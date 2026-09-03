package com.transitops.service;

import com.transitops.dto.response.VehicleHealthResponse;
import com.transitops.entity.Vehicle;
import com.transitops.enums.VehicleType;
import com.transitops.repository.AuditLogRepository;
import com.transitops.repository.MaintenanceLogRepository;
import com.transitops.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VehicleHealthServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private MaintenanceLogRepository maintenanceLogRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private VehicleHealthService vehicleHealthService;

    private Vehicle lowMileageTruck;

    @BeforeEach
    void setUp() {
        lowMileageTruck = Vehicle.builder()
                .registrationNumber("MH-12-AB-1234")
                .type(VehicleType.TRUCK)
                .odometer(50_000.0) // 10% of 500,000 km baseline -> 90 score
                .build();
        lowMileageTruck.setId(1L);
        lowMileageTruck.setCreatedAt(LocalDateTime.now().minusDays(30));
    }

    @Test
    @DisplayName("White-Box: New low-mileage vehicle with 0 maintenance logs has high health score")
    void testComputeHealthScore_HealthyVehicle() {
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(lowMileageTruck));
        when(maintenanceLogRepository.findByVehicleId(1L)).thenReturn(Collections.emptyList());
        when(auditLogRepository.findByEntityNameAndEntityIdOrderByCreatedAtAsc("Vehicles", "1"))
                .thenReturn(Collections.emptyList());

        VehicleHealthResponse health = vehicleHealthService.computeHealthScore(1L);

        assertThat(health).isNotNull();
        assertThat(health.getOverallScore()).isGreaterThanOrEqualTo(85.0);
        assertThat(health.getOdometerScore()).isEqualTo(90.0);
        assertThat(health.getMaintenanceFrequencyScore()).isEqualTo(100.0);
        assertThat(health.getDowntimeScore()).isEqualTo(100.0);
        assertThat(health.getRecommendation()).isNotBlank();
    }
}
