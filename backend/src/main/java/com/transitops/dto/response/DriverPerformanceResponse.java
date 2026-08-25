package com.transitops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverPerformanceResponse {
    private Long driverId;
    private String driverName;
    private int safetyScore;          // 0-100, from Driver entity
    private long completedTrips;
    private long cancelledTrips;
    private double completionRatePercent;
    private double overallScore;      // 0-100 weighted composite
    private int rank;                 // set only when returned as part of a leaderboard
}
