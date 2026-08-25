package com.transitops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleHealthResponse {
    private Long vehicleId;
    private String registrationNumber;
    private double overallScore;        // 0-100

    // Component breakdown, each 0-100
    private double odometerScore;
    private double maintenanceFrequencyScore;
    private double downtimeScore;

    private double downtimeRatioPercent; // % of vehicle's lifetime spent In Shop
    private long maintenanceEventCount;
    private String recommendation;
}
