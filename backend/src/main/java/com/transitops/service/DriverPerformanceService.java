package com.transitops.service;

import com.transitops.dto.response.DriverPerformanceResponse;
import com.transitops.entity.Driver;
import com.transitops.entity.Trip;
import com.transitops.enums.TripStatus;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.repository.DriverRepository;
import com.transitops.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

/**
 * Module 2 — Driver Intelligence (basic version).
 *
 * Honest scope note: without IoT/telematics we don't have harsh-braking,
 * over-speed, or fatigue data, so the score below is built entirely from
 * what the system already tracks: the existing safetyScore field, and each
 * driver's own trip completion vs cancellation history. It's a real,
 * queryable score — just a narrower input set than a full telematics-driven
 * version would use.
 *
 * Weighting: 50% safetyScore, 40% completion rate, 10% trip volume (capped).
 */
@Service
@RequiredArgsConstructor
public class DriverPerformanceService {

    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;

    private static final double VOLUME_CAP_TRIPS = 20.0; // trips at/above this count = full volume score

    public DriverPerformanceResponse computeScore(Long driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found: " + driverId));
        return score(driver, tripRepository.findByDriverId(driverId));
    }

    public List<DriverPerformanceResponse> leaderboard() {
        List<DriverPerformanceResponse> all = driverRepository.findAll().stream()
                .map(d -> score(d, tripRepository.findByDriverId(d.getId())))
                .sorted(Comparator.comparingDouble(DriverPerformanceResponse::getOverallScore).reversed())
                .toList();

        int rank = 1;
        for (DriverPerformanceResponse r : all) {
            r.setRank(rank++);
        }
        return all;
    }

    private DriverPerformanceResponse score(Driver driver, List<Trip> trips) {
        long completed = trips.stream().filter(t -> t.getStatus() == TripStatus.COMPLETED).count();
        long cancelled = trips.stream().filter(t -> t.getStatus() == TripStatus.CANCELLED).count();
        long decided = completed + cancelled; // trips that reached a final outcome

        double completionRate = decided == 0 ? 100.0 : (completed * 100.0 / decided);
        double volumeScore = Math.min(completed / VOLUME_CAP_TRIPS, 1.0) * 100.0;

        double overall = (driver.getSafetyScore() * 0.50)
                + (completionRate * 0.40)
                + (volumeScore * 0.10);

        return DriverPerformanceResponse.builder()
                .driverId(driver.getId())
                .driverName(driver.getName())
                .safetyScore(driver.getSafetyScore())
                .completedTrips(completed)
                .cancelledTrips(cancelled)
                .completionRatePercent(round2(completionRate))
                .overallScore(round2(overall))
                .build();
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
