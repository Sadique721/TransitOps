package com.transitops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class DashboardResponse {
    private long totalVehicles;
    private long availableVehicles;
    private long onTripVehicles;
    private long inShopVehicles;
    private long retiredVehicles;
    private long activeTrips;
    private long pendingTrips; // draft
    private long driversOnDuty;
    private long driversAvailable;
    private double fleetUtilizationPercent;
}
