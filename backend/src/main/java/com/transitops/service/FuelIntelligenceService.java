package com.transitops.service;

import com.transitops.entity.Trip;
import com.transitops.entity.Vehicle;
import com.transitops.enums.TripStatus;
import com.transitops.enums.VehicleType;
import com.transitops.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * Module 6 — Fuel Intelligence (basic, non-IoT version).
 *
 * Honest scope note: without a real telematics/GPS feed we don't have an
 * independent "actual distance travelled" reading per trip, so this uses
 * trip.plannedDistance as a stand-in for distance. That's a real limitation —
 * a driver could under-report distance to hide over-fuelling — but it's
 * enough to demonstrate the theft-detection *logic* end to end, and the
 * moment real odometer-per-trip or GPS data is added, only `resolveDistanceKm`
 * below needs to change.
 */
@Service
@RequiredArgsConstructor
public class FuelIntelligenceService {

    private final TripRepository tripRepository;

    // Fallback expected mileage (km/liter) by vehicle type, used only when a
    // vehicle doesn't yet have enough completed-trip history of its own.
    private static final Map<VehicleType, Double> BASELINE_KM_PER_LITER = new EnumMap<>(VehicleType.class);
    static {
        BASELINE_KM_PER_LITER.put(VehicleType.TRUCK, 4.0);
        BASELINE_KM_PER_LITER.put(VehicleType.VAN, 8.0);
        BASELINE_KM_PER_LITER.put(VehicleType.BIKE, 35.0);
        BASELINE_KM_PER_LITER.put(VehicleType.CAR, 15.0);
        BASELINE_KM_PER_LITER.put(VehicleType.OTHER, 6.0);
    }

    private static final double THEFT_DEVIATION_THRESHOLD_PERCENT = 20.0; // flag if actual > expected by 20%+
    private static final int MIN_HISTORY_TRIPS = 2;

    /**
     * Called right after a trip is marked Completed. Computes an "expected"
     * fuel figure for this trip based on the vehicle's own history (or a
     * type-based baseline if there isn't enough history yet), compares it to
     * what was actually logged, and flags a suspected-theft trip if the
     * deviation crosses the threshold.
     */
    public void evaluate(Trip trip) {
        Vehicle vehicle = trip.getVehicle();
        double distanceKm = resolveDistanceKm(trip);
        if (distanceKm <= 0 || trip.getFuelConsumed() == null) {
            return; // nothing sensible to compare
        }

        double kmPerLiter = averageKmPerLiterForVehicle(vehicle.getId())
                .orElse(BASELINE_KM_PER_LITER.getOrDefault(vehicle.getType(), 6.0));

        double expectedLiters = distanceKm / kmPerLiter;
        double deviationPercent = ((trip.getFuelConsumed() - expectedLiters) / expectedLiters) * 100.0;

        trip.setExpectedFuelConsumed(round2(expectedLiters));
        trip.setFuelDeviationPercent(round2(deviationPercent));
        trip.setFuelTheftSuspected(deviationPercent >= THEFT_DEVIATION_THRESHOLD_PERCENT);
    }

    /** Average km/liter from this vehicle's own completed trip history (excludes trips with no distance/fuel). */
    public java.util.Optional<Double> averageKmPerLiterForVehicle(Long vehicleId) {
        List<Trip> history = tripRepository.findByVehicleId(vehicleId).stream()
                .filter(t -> t.getStatus() == TripStatus.COMPLETED)
                .filter(t -> t.getFuelConsumed() != null && t.getFuelConsumed() > 0)
                .filter(t -> resolveDistanceKm(t) > 0)
                .toList();

        if (history.size() < MIN_HISTORY_TRIPS) {
            return java.util.Optional.empty();
        }

        double totalKm = history.stream().mapToDouble(this::resolveDistanceKm).sum();
        double totalLiters = history.stream().mapToDouble(Trip::getFuelConsumed).sum();
        return totalLiters > 0 ? java.util.Optional.of(totalKm / totalLiters) : java.util.Optional.empty();
    }

    /** All completed trips currently flagged as suspected fuel theft, most recent first. */
    public List<Trip> findSuspectedTheftTrips() {
        return tripRepository.findByStatus(TripStatus.COMPLETED).stream()
                .filter(Trip::getFuelTheftSuspected)
                .sorted((a, b) -> b.getCompletedAt().compareTo(a.getCompletedAt()))
                .toList();
    }

    private double resolveDistanceKm(Trip trip) {
        // Stand-in for real GPS distance — see class-level note above.
        return trip.getPlannedDistance() != null ? trip.getPlannedDistance() : 0.0;
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
