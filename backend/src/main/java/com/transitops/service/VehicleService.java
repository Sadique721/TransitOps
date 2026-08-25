package com.transitops.service;

import com.transitops.dto.request.VehicleRequest;
import com.transitops.entity.Vehicle;
import com.transitops.enums.VehicleStatus;
import com.transitops.exception.BusinessRuleException;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public Vehicle create(VehicleRequest request) {
        // PDF Mandatory Rule #1: registration number must be globally unique
        if (vehicleRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new BusinessRuleException(
                    "Registration number already exists: " + request.getRegistrationNumber());
        }

        Vehicle vehicle = Vehicle.builder()
                .registrationNumber(request.getRegistrationNumber())
                .name(request.getName())
                .model(request.getModel())
                .type(request.getType())
                .maxLoadCapacity(request.getMaxLoadCapacity())
                .odometer(request.getOdometer() != null ? request.getOdometer() : 0.0)
                .acquisitionCost(request.getAcquisitionCost())
                .region(request.getRegion())
                .status(VehicleStatus.AVAILABLE)
                .build();

        Vehicle saved = vehicleRepository.save(vehicle);
        auditLogService.log(null, "VEHICLE_CREATED", "Vehicles", saved.getId().toString(),
                null, saved.getRegistrationNumber(), null);
        return saved;
    }

    public List<Vehicle> findAll(VehicleStatus status) {
        return status != null ? vehicleRepository.findByStatus(status) : vehicleRepository.findAll();
    }

    public Vehicle findById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + id));
    }

    // Only vehicles eligible for dispatch (never Retired or In Shop - PDF Rule #2)
    public List<Vehicle> findDispatchable() {
        return vehicleRepository.findByStatus(VehicleStatus.AVAILABLE);
    }

    @Transactional
    public Vehicle update(Long id, VehicleRequest request) {
        Vehicle vehicle = findById(id);
        String oldReg = vehicle.getRegistrationNumber();

        if (!vehicle.getRegistrationNumber().equals(request.getRegistrationNumber())
                && vehicleRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new BusinessRuleException(
                    "Registration number already exists: " + request.getRegistrationNumber());
        }

        vehicle.setRegistrationNumber(request.getRegistrationNumber());
        vehicle.setName(request.getName());
        vehicle.setModel(request.getModel());
        vehicle.setType(request.getType());
        vehicle.setMaxLoadCapacity(request.getMaxLoadCapacity());
        vehicle.setAcquisitionCost(request.getAcquisitionCost());
        vehicle.setRegion(request.getRegion());

        Vehicle saved = vehicleRepository.save(vehicle);
        auditLogService.log(null, "VEHICLE_UPDATED", "Vehicles", id.toString(), oldReg, saved.getRegistrationNumber(), null);
        return saved;
    }

    @Transactional
    public Vehicle changeStatus(Long id, VehicleStatus newStatus) {
        Vehicle vehicle = findById(id);
        VehicleStatus old = vehicle.getStatus();

        // Can't manually move a vehicle that is currently On Trip via this endpoint
        if (old == VehicleStatus.ON_TRIP) {
            throw new BusinessRuleException("Cannot manually change status of a vehicle that is On Trip");
        }

        vehicle.setStatus(newStatus);
        Vehicle saved = vehicleRepository.save(vehicle);
        auditLogService.log(null, "VEHICLE_STATUS_CHANGED", "Vehicles", id.toString(),
                old.name(), newStatus.name(), null);
        return saved;
    }

    // Soft-delete = Retire (PDF: Available/In Shop -> Retire, permanent)
    @Transactional
    public void retire(Long id) {
        Vehicle vehicle = findById(id);
        if (vehicle.getStatus() == VehicleStatus.ON_TRIP) {
            throw new BusinessRuleException("Cannot retire a vehicle that is currently On Trip");
        }
        VehicleStatus old = vehicle.getStatus();
        vehicle.setStatus(VehicleStatus.RETIRED);
        vehicleRepository.save(vehicle);
        auditLogService.log(null, "VEHICLE_RETIRED", "Vehicles", id.toString(), old.name(), "RETIRED", null);
    }
}
