package com.transitops.service;

import com.transitops.dto.request.MaintenanceRequest;
import com.transitops.entity.MaintenanceLog;
import com.transitops.entity.Vehicle;
import com.transitops.enums.VehicleStatus;
import com.transitops.exception.BusinessRuleException;
import com.transitops.repository.MaintenanceLogRepository;
import com.transitops.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MaintenanceServiceTest {

    @Mock private MaintenanceLogRepository maintenanceLogRepository;
    @Mock private VehicleRepository vehicleRepository;
    @Mock private AuditLogService auditLogService;
    @Mock private com.transitops.service.EmailService emailService;

    @InjectMocks private MaintenanceService maintenanceService;

    private Vehicle vehicle;

    @BeforeEach
    void setUp() {
        vehicle = Vehicle.builder()
                .registrationNumber("MH-12-AB-1234")
                .name("Truck 1")
                .maxLoadCapacity(1000.0)
                .status(VehicleStatus.AVAILABLE)
                .build();
        vehicle.setId(1L);
    }

    @Test
    void create_shouldSetVehicleInShop_whenVehicleIsAvailable() {
        MaintenanceRequest request = new MaintenanceRequest();
        request.setVehicleId(1L);
        request.setDescription("Oil change");

        when(vehicleRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(vehicle));
        when(maintenanceLogRepository.findByVehicleIdAndIsActiveTrue(1L)).thenReturn(Optional.empty());
        when(maintenanceLogRepository.save(any())).thenAnswer(inv -> {
            MaintenanceLog log = inv.getArgument(0);
            log.setId(100L);
            return log;
        });

        MaintenanceLog result = maintenanceService.create(request);

        assertThat(result.getIsActive()).isTrue();
        assertThat(vehicle.getStatus()).isEqualTo(VehicleStatus.MAINTENANCE);
        verify(vehicleRepository).save(vehicle);
        verify(auditLogService).log(any(), eq("MAINTENANCE_OPENED"), any(), any(), any(), any(), any());
    }

    @Test
    void create_shouldThrow_whenVehicleIsOnTrip() {
        vehicle.setStatus(VehicleStatus.ON_TRIP);
        MaintenanceRequest request = new MaintenanceRequest();
        request.setVehicleId(1L);
        request.setDescription("Oil change");

        when(vehicleRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(vehicle));

        assertThatThrownBy(() -> maintenanceService.create(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("currently On Trip");

        verify(maintenanceLogRepository, never()).save(any());
    }

    @Test
    void create_shouldThrow_whenVehicleIsRetired() {
        vehicle.setStatus(VehicleStatus.RETIRED);
        MaintenanceRequest request = new MaintenanceRequest();
        request.setVehicleId(1L);
        request.setDescription("Oil change");

        when(vehicleRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(vehicle));

        assertThatThrownBy(() -> maintenanceService.create(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Retired vehicle");
    }

    @Test
    void create_shouldThrow_whenVehicleAlreadyHasActiveMaintenance() {
        MaintenanceRequest request = new MaintenanceRequest();
        request.setVehicleId(1L);
        request.setDescription("Oil change");

        when(vehicleRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(vehicle));
        
        MaintenanceLog activeLog = MaintenanceLog.builder().isActive(true).build();
        activeLog.setId(99L);
        when(maintenanceLogRepository.findByVehicleIdAndIsActiveTrue(1L))
                .thenReturn(Optional.of(activeLog));

        assertThatThrownBy(() -> maintenanceService.create(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("already has an active maintenance record");
    }

    @Test
    void close_shouldRestoreVehicleToAvailable() {
        MaintenanceLog log = MaintenanceLog.builder().vehicle(vehicle).isActive(true).build();
        log.setId(100L);
        vehicle.setStatus(VehicleStatus.MAINTENANCE);

        when(maintenanceLogRepository.findById(100L)).thenReturn(Optional.of(log));
        when(vehicleRepository.findByIdForUpdate(vehicle.getId())).thenReturn(Optional.of(vehicle));

        MaintenanceLog result = maintenanceService.close(100L);

        assertThat(result.getIsActive()).isFalse();
        assertThat(vehicle.getStatus()).isEqualTo(VehicleStatus.AVAILABLE);
        verify(auditLogService).log(any(), eq("MAINTENANCE_CLOSED"), any(), any(), any(), any(), any());
    }

    @Test
    void close_shouldNotOverrideRetiredStatus() {
        vehicle.setStatus(VehicleStatus.RETIRED);
        MaintenanceLog log = MaintenanceLog.builder().vehicle(vehicle).isActive(true).build();
        log.setId(100L);

        when(maintenanceLogRepository.findById(100L)).thenReturn(Optional.of(log));
        when(vehicleRepository.findByIdForUpdate(vehicle.getId())).thenReturn(Optional.of(vehicle));

        maintenanceService.close(100L);

        assertThat(vehicle.getStatus()).isEqualTo(VehicleStatus.RETIRED);
        verify(vehicleRepository, never()).save(any());
    }

    @Test
    void close_shouldThrow_whenAlreadyClosed() {
        MaintenanceLog log = MaintenanceLog.builder().vehicle(vehicle).isActive(false).build();
        log.setId(100L);
        when(maintenanceLogRepository.findById(100L)).thenReturn(Optional.of(log));

        assertThatThrownBy(() -> maintenanceService.close(100L))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("already closed");
    }
}
