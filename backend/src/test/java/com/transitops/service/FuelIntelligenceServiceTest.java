package com.transitops.service;

import com.transitops.entity.Trip;
import com.transitops.entity.Vehicle;
import com.transitops.enums.TripStatus;
import com.transitops.enums.VehicleType;
import com.transitops.repository.TripRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FuelIntelligenceServiceTest {

    @Mock
    private TripRepository tripRepository;

    @InjectMocks
    private FuelIntelligenceService fuelIntelligenceService;

    private Vehicle sampleTruck;

    @BeforeEach
    void setUp() {
        sampleTruck = Vehicle.builder()
                .registrationNumber("MH-12-AB-1234")
                .type(VehicleType.TRUCK)
                .build();
        sampleTruck.setId(1L);
    }

    @Test
    @DisplayName("White-Box: Trip with fuel consumption within normal range is NOT flagged as suspected theft")
    void testEvaluate_NormalFuel_NotFlagged() {
        // Truck baseline: 4.0 km/L. Distance: 100 km -> Expected fuel: 25.0 L.
        // Actual fuel: 26.0 L (+4% deviation, < 20% threshold)
        Trip trip = Trip.builder()
                .vehicle(sampleTruck)
                .plannedDistance(100.0)
                .fuelConsumed(26.0)
                .status(TripStatus.COMPLETED)
                .build();
        trip.setId(100L);

        when(tripRepository.findByVehicleId(1L)).thenReturn(Collections.emptyList());

        fuelIntelligenceService.evaluate(trip);

        assertThat(trip.getFuelTheftSuspected()).isFalse();
        assertThat(trip.getExpectedFuelConsumed()).isEqualTo(25.0);
        assertThat(trip.getFuelDeviationPercent()).isLessThan(20.0);
    }

    @Test
    @DisplayName("White-Box: Trip with fuel consumption > 20% deviation IS flagged as suspected theft")
    void testEvaluate_ExcessFuel_FlaggedSuspectedTheft() {
        // Truck baseline: 4.0 km/L. Distance: 100 km -> Expected fuel: 25.0 L.
        // Actual fuel: 35.0 L (+40% deviation, >= 20% threshold)
        Trip trip = Trip.builder()
                .vehicle(sampleTruck)
                .plannedDistance(100.0)
                .fuelConsumed(35.0)
                .status(TripStatus.COMPLETED)
                .build();
        trip.setId(101L);

        when(tripRepository.findByVehicleId(1L)).thenReturn(Collections.emptyList());

        fuelIntelligenceService.evaluate(trip);

        assertThat(trip.getFuelTheftSuspected()).isTrue();
        assertThat(trip.getExpectedFuelConsumed()).isEqualTo(25.0);
        assertThat(trip.getFuelDeviationPercent()).isEqualTo(40.0);
    }

    @Test
    @DisplayName("White-Box: Uses vehicle's historical average when >= 2 prior completed trips exist")
    void testEvaluate_UsesHistoricalAverage() {
        // 2 prior trips: 100km / 20L (5 km/L) and 200km / 40L (5 km/L) -> Historic Avg: 5.0 km/L
        Trip pastTrip1 = Trip.builder().status(TripStatus.COMPLETED).plannedDistance(100.0).fuelConsumed(20.0).build();
        Trip pastTrip2 = Trip.builder().status(TripStatus.COMPLETED).plannedDistance(200.0).fuelConsumed(40.0).build();

        Trip currentTrip = Trip.builder()
                .vehicle(sampleTruck)
                .plannedDistance(100.0)
                .fuelConsumed(28.0) // Expected @ 5 km/L is 20L. 28L is +40% deviation!
                .status(TripStatus.COMPLETED)
                .build();
        currentTrip.setId(102L);

        when(tripRepository.findByVehicleId(1L))
                .thenReturn(List.of(pastTrip1, pastTrip2));

        fuelIntelligenceService.evaluate(currentTrip);

        assertThat(currentTrip.getExpectedFuelConsumed()).isEqualTo(20.0);
        assertThat(currentTrip.getFuelTheftSuspected()).isTrue();
        assertThat(currentTrip.getFuelDeviationPercent()).isEqualTo(40.0);
    }
}
