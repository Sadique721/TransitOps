package com.transitops.controller;

import com.transitops.entity.Trip;
import com.transitops.service.FuelIntelligenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/fuel-intelligence")
@RequiredArgsConstructor
public class FuelIntelligenceController {

    private final FuelIntelligenceService fuelIntelligenceService;

    // Dashboard card: "Fuel Theft Detection" — all completed trips currently flagged.
    @GetMapping("/theft-alerts")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'FINANCIAL_ANALYST', 'SAFETY_OFFICER')")
    public ResponseEntity<List<Trip>> theftAlerts() {
        return ResponseEntity.ok(fuelIntelligenceService.findSuspectedTheftTrips());
    }

    // Mileage trend for a single vehicle (km/liter, based on its completed-trip history).
    @GetMapping("/vehicles/{vehicleId}/mileage-trend")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'FINANCIAL_ANALYST', 'SAFETY_OFFICER')")
    public ResponseEntity<Map<String, Object>> mileageTrend(@PathVariable Long vehicleId) {
        Optional<Double> avg = fuelIntelligenceService.averageKmPerLiterForVehicle(vehicleId);
        return ResponseEntity.ok(Map.of(
                "vehicleId", vehicleId,
                "averageKmPerLiter", avg.orElse(null),
                "hasEnoughHistory", avg.isPresent()
        ));
    }
}
