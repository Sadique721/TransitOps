package com.transitops.service;

import com.transitops.dto.request.VehicleRequest;
import com.transitops.entity.Vehicle;
import com.transitops.enums.VehicleStatus;
import com.transitops.enums.VehicleType;
import com.transitops.exception.BusinessRuleException;
import com.transitops.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private VehicleService vehicleService;

    private Vehicle sampleVehicle;
    private VehicleRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleVehicle = Vehicle.builder()
                .registrationNumber("MH-12-AB-1234")
                .name("Volvo FH16")
                .model("Globetrotter")
                .type(VehicleType.TRUCK)
                .maxLoadCapacity(12000.0)
                .odometer(5000.0)
                .acquisitionCost(BigDecimal.valueOf(3500000.0))
                .region("North Zone")
                .status(VehicleStatus.AVAILABLE)
                .build();
        sampleVehicle.setId(1L);

        sampleRequest = new VehicleRequest();
        sampleRequest.setRegistrationNumber("MH-12-AB-1234");
        sampleRequest.setName("Volvo FH16");
        sampleRequest.setModel("Globetrotter");
        sampleRequest.setType(VehicleType.TRUCK);
        sampleRequest.setMaxLoadCapacity(12000.0);
        sampleRequest.setOdometer(5000.0);
        sampleRequest.setAcquisitionCost(BigDecimal.valueOf(3500000.0));
        sampleRequest.setRegion("North Zone");
    }

    @Test
    @DisplayName("White-Box: Successful vehicle creation sets status to AVAILABLE and logs audit")
    void testCreateVehicle_Success() {
        when(vehicleRepository.existsByRegistrationNumber("MH-12-AB-1234")).thenReturn(false);
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(sampleVehicle);

        Vehicle created = vehicleService.create(sampleRequest);

        assertThat(created).isNotNull();
        assertThat(created.getRegistrationNumber()).isEqualTo("MH-12-AB-1234");
        assertThat(created.getStatus()).isEqualTo(VehicleStatus.AVAILABLE);
        verify(auditLogService, times(1)).log(any(), eq("VEHICLE_CREATED"), eq("Vehicles"), eq("1"), any(), eq("MH-12-AB-1234"), any());
    }

    @Test
    @DisplayName("White-Box: Duplicate registration number throws BusinessRuleException")
    void testCreateVehicle_DuplicateRegistration_ThrowsException() {
        when(vehicleRepository.existsByRegistrationNumber("MH-12-AB-1234")).thenReturn(true);

        assertThatThrownBy(() -> vehicleService.create(sampleRequest))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Registration number already exists");

        verify(vehicleRepository, never()).save(any());
    }

    @Test
    @DisplayName("White-Box: Find dispatchable returns only AVAILABLE vehicles")
    void testFindDispatchable() {
        when(vehicleRepository.findByStatus(VehicleStatus.AVAILABLE)).thenReturn(List.of(sampleVehicle));

        List<Vehicle> dispatchable = vehicleService.findDispatchable();

        assertThat(dispatchable).hasSize(1);
        assertThat(dispatchable.get(0).getStatus()).isEqualTo(VehicleStatus.AVAILABLE);
    }

    @Test
    @DisplayName("White-Box: Changing status from ON_TRIP manually throws BusinessRuleException")
    void testChangeStatus_OnTrip_ThrowsException() {
        sampleVehicle.setStatus(VehicleStatus.ON_TRIP);
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(sampleVehicle));

        assertThatThrownBy(() -> vehicleService.changeStatus(1L, VehicleStatus.AVAILABLE))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Cannot manually change status of a vehicle that is On Trip");
    }

    @Test
    @DisplayName("White-Box: Retiring an ON_TRIP vehicle throws BusinessRuleException")
    void testRetire_OnTrip_ThrowsException() {
        sampleVehicle.setStatus(VehicleStatus.ON_TRIP);
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(sampleVehicle));

        assertThatThrownBy(() -> vehicleService.retire(1L))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Cannot retire a vehicle that is currently On Trip");
    }

    @Test
    @DisplayName("White-Box: Retiring an AVAILABLE vehicle marks it as RETIRED")
    void testRetire_Available_Success() {
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(sampleVehicle));
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(sampleVehicle);

        vehicleService.retire(1L);

        assertThat(sampleVehicle.getStatus()).isEqualTo(VehicleStatus.RETIRED);
        verify(auditLogService, times(1)).log(any(), eq("VEHICLE_RETIRED"), eq("Vehicles"), eq("1"), any(), any(), any());
    }
}
