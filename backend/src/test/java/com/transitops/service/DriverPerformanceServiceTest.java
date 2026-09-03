package com.transitops.service;

import com.transitops.dto.response.DriverPerformanceResponse;
import com.transitops.entity.Driver;
import com.transitops.entity.Trip;
import com.transitops.enums.DriverStatus;
import com.transitops.enums.TripStatus;
import com.transitops.repository.DriverRepository;
import com.transitops.repository.TripRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DriverPerformanceServiceTest {

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private TripRepository tripRepository;

    @InjectMocks
    private DriverPerformanceService driverPerformanceService;

    private Driver driverA;
    private Driver driverB;

    @BeforeEach
    void setUp() {
        driverA = Driver.builder()
                .name("Arun V.")
                .safetyScore(100)
                .status(DriverStatus.AVAILABLE)
                .build();
        driverA.setId(1L);

        driverB = Driver.builder()
                .name("Karan S.")
                .safetyScore(80)
                .status(DriverStatus.AVAILABLE)
                .build();
        driverB.setId(2L);
    }

    @Test
    @DisplayName("White-Box: Driver with 100 safety score and 100% completion gets high overall score")
    void testComputeScore_PerfectRecord() {
        Trip trip1 = Trip.builder().status(TripStatus.COMPLETED).build();
        Trip trip2 = Trip.builder().status(TripStatus.COMPLETED).build();

        when(driverRepository.findById(1L)).thenReturn(Optional.of(driverA));
        when(tripRepository.findByDriverId(1L)).thenReturn(List.of(trip1, trip2));

        DriverPerformanceResponse perf = driverPerformanceService.computeScore(1L);

        assertThat(perf).isNotNull();
        assertThat(perf.getSafetyScore()).isEqualTo(100);
        assertThat(perf.getCompletionRatePercent()).isEqualTo(100.0);
        assertThat(perf.getOverallScore()).isGreaterThan(90.0);
    }

    @Test
    @DisplayName("White-Box: Leaderboard correctly ranks higher scoring drivers first")
    void testLeaderboard_RanksCorrectly() {
        when(driverRepository.findAll()).thenReturn(List.of(driverA, driverB));
        when(tripRepository.findByDriverId(1L)).thenReturn(List.of(Trip.builder().status(TripStatus.COMPLETED).build()));
        when(tripRepository.findByDriverId(2L)).thenReturn(List.of(Trip.builder().status(TripStatus.CANCELLED).build()));

        List<DriverPerformanceResponse> list = driverPerformanceService.leaderboard();

        assertThat(list).hasSize(2);
        assertThat(list.get(0).getDriverId()).isEqualTo(1L);
        assertThat(list.get(0).getRank()).isEqualTo(1);
        assertThat(list.get(1).getDriverId()).isEqualTo(2L);
        assertThat(list.get(1).getRank()).isEqualTo(2);
    }
}
