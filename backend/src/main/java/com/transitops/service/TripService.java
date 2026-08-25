package com.transitops.service;

import com.transitops.dto.request.TripCompleteRequest;
import com.transitops.dto.request.TripCreateRequest;
import com.transitops.entity.Driver;
import com.transitops.entity.Trip;
import com.transitops.entity.Vehicle;
import com.transitops.enums.DriverStatus;
import com.transitops.enums.TripStatus;
import com.transitops.enums.VehicleStatus;
import com.transitops.exception.BusinessRuleException;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.repository.DriverRepository;
import com.transitops.repository.TripRepository;
import com.transitops.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final AuditLogService auditLogService;
    private final SimpMessagingTemplate messagingTemplate; // WebSocket broadcast (Section 8.2)
    private final FuelIntelligenceService fuelIntelligenceService;
    private final EmailService emailService;

    @Transactional
    public Trip createDraft(TripCreateRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + request.getVehicleId()));
        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found: " + request.getDriverId()));

        // PDF Rule: cargo weight must not exceed vehicle's max load capacity (checked at create AND dispatch)
        if (request.getCargoWeight() > vehicle.getMaxLoadCapacity()) {
            throw new BusinessRuleException(String.format(
                    "Cargo weight %.2f kg exceeds vehicle max load capacity %.2f kg",
                    request.getCargoWeight(), vehicle.getMaxLoadCapacity()));
        }

        Trip trip = Trip.builder()
                .source(request.getSource())
                .destination(request.getDestination())
                .cargoWeight(request.getCargoWeight())
                .plannedDistance(request.getPlannedDistance())
                .vehicle(vehicle)
                .driver(driver)
                .status(TripStatus.DRAFT)
                .build();

        Trip saved = tripRepository.save(trip);
        auditLogService.log(null, "TRIP_CREATED", "Trips", saved.getId().toString(), null, saved.getTripNumber(), null);
        return saved;
    }

    public Trip findById(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found: " + id));
    }

    public List<Trip> findAll(TripStatus status) {
        return status != null ? tripRepository.findByStatus(status) : tripRepository.findAll();
    }

    @Transactional
    public Trip updateDraft(Long id, TripCreateRequest request) {
        Trip trip = findById(id);
        if (trip.getStatus() != TripStatus.DRAFT) {
            throw new BusinessRuleException("Only Draft trips can be edited");
        }

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + request.getVehicleId()));
        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found: " + request.getDriverId()));

        if (request.getCargoWeight() > vehicle.getMaxLoadCapacity()) {
            throw new BusinessRuleException("Cargo weight exceeds vehicle max load capacity");
        }

        trip.setSource(request.getSource());
        trip.setDestination(request.getDestination());
        trip.setCargoWeight(request.getCargoWeight());
        trip.setPlannedDistance(request.getPlannedDistance());
        trip.setVehicle(vehicle);
        trip.setDriver(driver);

        return tripRepository.save(trip);
    }

    // ===================== DISPATCH: Draft -> Dispatched =====================
    @Transactional
    public Trip dispatch(Long tripId) {
        Trip trip = findById(tripId);

        if (trip.getStatus() != TripStatus.DRAFT) {
            throw new BusinessRuleException("Only Draft trips can be dispatched. Current status: " + trip.getStatus());
        }

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        // Rule: vehicle must be Available (never Retired/In Shop/On Trip)
        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new BusinessRuleException(
                    "Vehicle " + vehicle.getRegistrationNumber() + " is not Available (status: " + vehicle.getStatus() + ")");
        }

        // Rule: driver must be Available, license not expired, not Suspended
        if (driver.getStatus() != DriverStatus.AVAILABLE) {
            throw new BusinessRuleException(
                    "Driver " + driver.getName() + " is not Available (status: " + driver.getStatus() + ")");
        }
        if (driver.getLicenseExpiryDate().isBefore(LocalDate.now())) {
            throw new BusinessRuleException("Driver " + driver.getName() + "'s license has expired");
        }

        // Rule: cargo weight vs capacity (re-validated at dispatch time)
        if (trip.getCargoWeight() > vehicle.getMaxLoadCapacity()) {
            throw new BusinessRuleException("Cargo weight exceeds vehicle max load capacity");
        }

        // Transition: both flip to On Trip, trip becomes Dispatched
        vehicle.setStatus(VehicleStatus.ON_TRIP);
        driver.setStatus(DriverStatus.ON_TRIP);
        trip.setStatus(TripStatus.DISPATCHED);
        trip.setDispatchedAt(LocalDateTime.now());

        vehicleRepository.save(vehicle);
        driverRepository.save(driver);
        Trip saved = tripRepository.save(trip);

        auditLogService.log(null, "TRIP_DISPATCHED", "Trips", tripId.toString(), "DRAFT", "DISPATCHED", null);
        broadcast("trip_updated", Map.of(
                "tripId", saved.getId(),
                "tripNumber", saved.getTripNumber(),
                "status", "DISPATCHED",
                "message", "Trip #" + saved.getTripNumber() + " Dispatched"
        ));

        return saved;
    }

    // ===================== COMPLETE: Dispatched -> Completed =====================
    @Transactional
    public Trip complete(Long tripId, TripCompleteRequest request) {
        Trip trip = findById(tripId);

        if (trip.getStatus() != TripStatus.DISPATCHED) {
            throw new BusinessRuleException("Only Dispatched trips can be completed. Current status: " + trip.getStatus());
        }

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        trip.setFinalOdometer(request.getFinalOdometer());
        trip.setFuelConsumed(request.getFuelConsumed());
        trip.setStatus(TripStatus.COMPLETED);
        trip.setCompletedAt(LocalDateTime.now());

        // Module 6: Fuel Intelligence — flag suspected fuel theft before persisting
        fuelIntelligenceService.evaluate(trip);

        // Update vehicle odometer with the trip's final reading
        vehicle.setOdometer(request.getFinalOdometer());
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        driver.setStatus(DriverStatus.AVAILABLE);

        vehicleRepository.save(vehicle);
        driverRepository.save(driver);
        Trip saved = tripRepository.save(trip);

        auditLogService.log(null, "TRIP_COMPLETED", "Trips", tripId.toString(), "DISPATCHED", "COMPLETED", null);
        broadcast("trip_updated", Map.of(
                "tripId", saved.getId(),
                "tripNumber", saved.getTripNumber(),
                "status", "COMPLETED",
                "message", "Trip #" + saved.getTripNumber() + " Completed"
        ));

        if (Boolean.TRUE.equals(saved.getFuelTheftSuspected())) {
            auditLogService.log(null, "FUEL_THEFT_SUSPECTED", "Trips", tripId.toString(),
                    null, String.format("deviation=%.2f%%", saved.getFuelDeviationPercent()), null);
            broadcast("fuel_alert", Map.of(
                    "tripId", saved.getId(),
                    "tripNumber", saved.getTripNumber(),
                    "vehicle", vehicle.getRegistrationNumber(),
                    "deviationPercent", saved.getFuelDeviationPercent(),
                    "message", "Possible fuel theft on Trip #" + saved.getTripNumber()
                            + ": consumed " + saved.getFuelDeviationPercent() + "% more than expected"
            ));
            emailService.sendFuelAlert(saved.getTripNumber(), vehicle.getRegistrationNumber(), saved.getFuelDeviationPercent());
        }

        return saved;
    }

    // ===================== CANCEL: Dispatched -> Cancelled =====================
    @Transactional
    public Trip cancel(Long tripId) {
        Trip trip = findById(tripId);

        if (trip.getStatus() != TripStatus.DISPATCHED && trip.getStatus() != TripStatus.DRAFT) {
            throw new BusinessRuleException("Only Draft or Dispatched trips can be cancelled. Current status: " + trip.getStatus());
        }

        boolean wasDispatched = trip.getStatus() == TripStatus.DISPATCHED;
        trip.setStatus(TripStatus.CANCELLED);

        if (wasDispatched) {
            Vehicle vehicle = trip.getVehicle();
            Driver driver = trip.getDriver();
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            driver.setStatus(DriverStatus.AVAILABLE);
            vehicleRepository.save(vehicle);
            driverRepository.save(driver);
        }

        Trip saved = tripRepository.save(trip);

        auditLogService.log(null, "TRIP_CANCELLED", "Trips", tripId.toString(),
                wasDispatched ? "DISPATCHED" : "DRAFT", "CANCELLED", null);
        broadcast("trip_updated", Map.of(
                "tripId", saved.getId(),
                "tripNumber", saved.getTripNumber(),
                "status", "CANCELLED",
                "message", "Trip #" + saved.getTripNumber() + " Cancelled"
        ));

        return saved;
    }

    // "AI Suggest" feature (Section 7.3): suggests the Available vehicle with
    // the highest remaining capacity headroom for the given cargo weight.
    public Vehicle suggestVehicle(double cargoWeight) {
        return vehicleRepository.findByStatus(VehicleStatus.AVAILABLE).stream()
                .filter(v -> v.getMaxLoadCapacity() >= cargoWeight)
                .min((a, b) -> Double.compare(
                        a.getMaxLoadCapacity() - cargoWeight,
                        b.getMaxLoadCapacity() - cargoWeight))
                .orElseThrow(() -> new BusinessRuleException(
                        "No available vehicle can carry " + cargoWeight + " kg"));
    }

    private void broadcast(String event, Object payload) {
        messagingTemplate.convertAndSend("/topic/" + event, payload);
    }
}
