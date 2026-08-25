package com.transitops.service;

import com.transitops.dto.response.VehicleHealthResponse;
import com.transitops.entity.AuditLog;
import com.transitops.entity.Vehicle;
import com.transitops.enums.VehicleType;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.repository.AuditLogRepository;
import com.transitops.repository.MaintenanceLogRepository;
import com.transitops.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * Module 1 — Fleet Intelligence: Vehicle Health Score (basic, non-IoT version).
 *
 * Honest scope note: real tyre/brake/battery sensor data isn't available, so
 * this composite score uses only what the system already records:
 *   - odometer wear vs a typical lifetime distance for the vehicle's type
 *   - how often the vehicle has needed maintenance, relative to its age
 *   - how much of its lifetime it has actually spent "In Shop"
 *     (reconstructed from the existing VEHICLE_STATUS_CHANGED audit trail)
 * Swapping in real IoT sensor scores later just means adding new weighted
 * components here — the scoring/recommendation shape stays the same.
 */
@Service
@RequiredArgsConstructor
public class VehicleHealthService {

    private final VehicleRepository vehicleRepository;
    private final MaintenanceLogRepository maintenanceLogRepository;
    private final AuditLogRepository auditLogRepository;

    private static final Map<VehicleType, Double> LIFETIME_KM_BASELINE = new EnumMap<>(VehicleType.class);
    static {
        LIFETIME_KM_BASELINE.put(VehicleType.TRUCK, 500_000.0);
        LIFETIME_KM_BASELINE.put(VehicleType.VAN, 300_000.0);
        LIFETIME_KM_BASELINE.put(VehicleType.BIKE, 150_000.0);
        LIFETIME_KM_BASELINE.put(VehicleType.CAR, 250_000.0);
        LIFETIME_KM_BASELINE.put(VehicleType.OTHER, 300_000.0);
    }

    public VehicleHealthResponse computeHealthScore(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + vehicleId));

        double odometerScore = odometerScore(vehicle);
        long maintenanceCount = maintenanceLogRepository.findByVehicleId(vehicleId).size();
        double maintenanceScore = maintenanceFrequencyScore(vehicle, maintenanceCount);
        double downtimeRatioPercent = downtimeRatioPercent(vehicle);
        double downtimeScore = Math.max(0.0, 100.0 - downtimeRatioPercent);

        double overall = (odometerScore * 0.30) + (maintenanceScore * 0.35) + (downtimeScore * 0.35);

        return VehicleHealthResponse.builder()
                .vehicleId(vehicle.getId())
                .registrationNumber(vehicle.getRegistrationNumber())
                .overallScore(round2(overall))
                .odometerScore(round2(odometerScore))
                .maintenanceFrequencyScore(round2(maintenanceScore))
                .downtimeScore(round2(downtimeScore))
                .downtimeRatioPercent(round2(downtimeRatioPercent))
                .maintenanceEventCount(maintenanceCount)
                .recommendation(recommendationFor(overall))
                .build();
    }

    private double odometerScore(Vehicle vehicle) {
        double baseline = LIFETIME_KM_BASELINE.getOrDefault(vehicle.getType(), 300_000.0);
        double wearRatio = Math.min((vehicle.getOdometer() == null ? 0.0 : vehicle.getOdometer()) / baseline, 1.0);
        return (1.0 - wearRatio) * 100.0;
    }

    private double maintenanceFrequencyScore(Vehicle vehicle, long maintenanceCount) {
        double ageYears = Math.max(
                Duration.between(vehicle.getCreatedAt() != null ? vehicle.getCreatedAt() : LocalDateTime.now(),
                        LocalDateTime.now()).toDays() / 365.0,
                0.1); // avoid div-by-near-zero for brand-new vehicles
        double eventsPerYear = maintenanceCount / ageYears;
        return Math.max(0.0, 100.0 - (eventsPerYear * 10.0));
    }

    /** Reconstructs total time spent "In Shop" from the VEHICLE_STATUS_CHANGED audit trail. */
    private double downtimeRatioPercent(Vehicle vehicle) {
        List<AuditLog> history = auditLogRepository
                .findByEntityNameAndEntityIdOrderByCreatedAtAsc("Vehicles", vehicle.getId().toString())
                .stream()
                .filter(a -> "VEHICLE_STATUS_CHANGED".equals(a.getAction()))
                .toList();

        LocalDateTime lifetimeStart = vehicle.getCreatedAt() != null ? vehicle.getCreatedAt() : LocalDateTime.now();
        LocalDateTime now = LocalDateTime.now();
        long totalLifetimeMinutes = Math.max(Duration.between(lifetimeStart, now).toMinutes(), 1);

        long downtimeMinutes = 0;
        LocalDateTime inShopSince = null;

        for (AuditLog entry : history) {
            if ("IN_SHOP".equals(entry.getNewValue()) || "MAINTENANCE".equals(entry.getNewValue())) {
                inShopSince = entry.getCreatedAt();
            } else if (inShopSince != null) {
                downtimeMinutes += Duration.between(inShopSince, entry.getCreatedAt()).toMinutes();
                inShopSince = null;
            }
        }
        if (inShopSince != null) { // still in shop right now
            downtimeMinutes += Duration.between(inShopSince, now).toMinutes();
        }

        return Math.min((downtimeMinutes * 100.0) / totalLifetimeMinutes, 100.0);
    }

    private String recommendationFor(double overallScore) {
        if (overallScore < 40) return "Poor health — schedule a full inspection and evaluate replacement.";
        if (overallScore < 70) return "Fair health — schedule preventive maintenance soon.";
        return "Healthy — routine monitoring is sufficient.";
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
