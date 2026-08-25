package com.transitops.service;

import com.transitops.dto.request.TripCompleteRequest;
import com.transitops.dto.request.TripCreateRequest;
import com.transitops.entity.Driver;
import com.transitops.entity.Trip;
import com.transitops.entity.Vehicle;
import com.transitops.enums.DriverStatus;
import com.transitops.enums.TripStatus;
import com.transitops.enums.VehicleStatus;
import com.transitops.exception.BusinessRuleException;
import com.transitops.repository.DriverRepository;
import com.transitops.repository.TripRepository;
import com.transitops.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Covers the audit's #1 critical gap ("Zero Test Coverage") for the core
 * Trip lifecycle state machine: PDF Rule dispatch validations, complete, and
 * cancel — including the fuel-theft hook and WebSocket/audit side effects.
 */
@ExtendWith(MockitoExtension.class)
class TripServiceTest {

    @Mock private TripRepository tripRepository;
    @Mock private VehicleRepository vehicleRepository;
    @Mock private DriverRepository driverRepository;
    @Mock private AuditLogService auditLogService;
    @Mock private SimpMessagingTemplate messagingTemplate;
    @Mock private FuelIntelligenceService fuelIntelligenceService;

    @InjectMocks private TripService tripService;

    private Vehicle availableVehicle;
    private Driver validDriver;
    private Trip draftTrip;

    @BeforeEach
    void setUp() {
        availableVehicle = Vehicle.builder()
                .registrationNumber("MH-12-AB-1234")
                .name("Truck 1")
                .maxLoadCapacity(1000.0)
                .status(VehicleStatus.AVAILABLE)
                .build();
        availableVehicle.setId(1L);

        validDriver = Driver.builder()
                .name("Ramesh")
                .licenseNumber("DL123")
                .licenseExpiryDate(LocalDate.now().plusYears(1))
                .status(DriverStatus.AVAILABLE)
                .build();
        validDriver.setId(1L);

        draftTrip = Trip.builder()
                .tripNumber("TR-1")
                .source("A")
                .destination("B")
                .cargoWeight(500.0)
                .plannedDistance(100.0)
                .vehicle(availableVehicle)
                .driver(validDriver)
                .status(TripStatus.DRAFT)
                .build();
        draftTrip.setId(10L);
    }

    // ------------------------- createDraft -------------------------

    @Test
    void createDraft_shouldThrow_whenCargoExceedsVehicleCapacity() {
        TripCreateRequest request = new TripCreateRequest();
        request.setSource("A");
        request.setDestination("B");
        request.setCargoWeight(5000.0); // exceeds 1000kg capacity
        request.setVehicleId(1L);
        request.setDriverId(1L);

        when(vehicleRepository.findById(1L)).thenReturn(java.util.Optional.of(availableVehicle));
        when(driverRepository.findById(1L)).thenReturn(java.util.Optional.of(validDriver));

        assertThatThrownBy(() -> tripService.createDraft(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("exceeds vehicle max load capacity");

        verify(tripRepository, never()).save(any());
    }

    // ------------------------- dispatch -------------------------

    @Test
    void dispatch_shouldSucceed_whenAllRulesPass() {
        when(tripRepository.findByIdForUpdate(10L)).thenReturn(java.util.Optional.of(draftTrip));
        when(vehicleRepository.findByIdForUpdate(1L)).thenReturn(java.util.Optional.of(availableVehicle));
        when(driverRepository.findByIdForUpdate(1L)).thenReturn(java.util.Optional.of(validDriver));
        when(vehicleRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(driverRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(tripRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Trip result = tripService.dispatch(10L);

        assertThat(result.getStatus()).isEqualTo(TripStatus.DISPATCHED);
        assertThat(availableVehicle.getStatus()).isEqualTo(VehicleStatus.ON_TRIP);
        assertThat(validDriver.getStatus()).isEqualTo(DriverStatus.ON_TRIP);
        verify(auditLogService).log(any(), eq("TRIP_DISPATCHED"), eq("Trips"), eq("10"), any(), any(), any());
        verify(messagingTemplate).convertAndSend(eq("/topic/trip_updated"), any(Object.class));
    }

    @Test
    void dispatch_shouldThrow_whenTripNotDraft() {
        draftTrip.setStatus(TripStatus.COMPLETED);
        when(tripRepository.findByIdForUpdate(10L)).thenReturn(java.util.Optional.of(draftTrip));

        assertThatThrownBy(() -> tripService.dispatch(10L))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Only Draft trips can be dispatched");
    }

    @Test
    void dispatch_shouldThrow_whenVehicleNotAvailable() {
        availableVehicle.setStatus(VehicleStatus.MAINTENANCE);
        when(tripRepository.findByIdForUpdate(10L)).thenReturn(java.util.Optional.of(draftTrip));
        when(vehicleRepository.findByIdForUpdate(1L)).thenReturn(java.util.Optional.of(availableVehicle));
        when(driverRepository.findByIdForUpdate(1L)).thenReturn(java.util.Optional.of(validDriver));

        assertThatThrownBy(() -> tripService.dispatch(10L))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("is not Available");
    }

    @Test
    void dispatch_shouldThrow_whenDriverLicenseExpired() {
        validDriver.setLicenseExpiryDate(LocalDate.now().minusDays(1));
        when(tripRepository.findByIdForUpdate(10L)).thenReturn(java.util.Optional.of(draftTrip));
        when(vehicleRepository.findByIdForUpdate(1L)).thenReturn(java.util.Optional.of(availableVehicle));
        when(driverRepository.findByIdForUpdate(1L)).thenReturn(java.util.Optional.of(validDriver));

        assertThatThrownBy(() -> tripService.dispatch(10L))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("license has expired");
    }

    @Test
    void dispatch_shouldThrow_whenDriverNotAvailable() {
        validDriver.setStatus(DriverStatus.SUSPENDED);
        when(tripRepository.findByIdForUpdate(10L)).thenReturn(java.util.Optional.of(draftTrip));
        when(vehicleRepository.findByIdForUpdate(1L)).thenReturn(java.util.Optional.of(availableVehicle));
        when(driverRepository.findByIdForUpdate(1L)).thenReturn(java.util.Optional.of(validDriver));

        assertThatThrownBy(() -> tripService.dispatch(10L))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("is not Available");
    }

    @Test
    void dispatch_shouldThrow_whenCargoExceedsCapacityAtDispatchTime() {
        // Capacity could have been edited down between draft creation and dispatch.
        availableVehicle.setMaxLoadCapacity(100.0);
        when(tripRepository.findByIdForUpdate(10L)).thenReturn(java.util.Optional.of(draftTrip));
        when(vehicleRepository.findByIdForUpdate(1L)).thenReturn(java.util.Optional.of(availableVehicle));
        when(driverRepository.findByIdForUpdate(1L)).thenReturn(java.util.Optional.of(validDriver));

        assertThatThrownBy(() -> tripService.dispatch(10L))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("exceeds vehicle max load capacity");
    }

    // ------------------------- complete -------------------------

    @Test
    void complete_shouldSetStatusCompleted_restoreVehicleAndDriver_andRunFuelIntelligence() {
        draftTrip.setStatus(TripStatus.DISPATCHED);
        availableVehicle.setStatus(VehicleStatus.ON_TRIP);
        validDriver.setStatus(DriverStatus.ON_TRIP);

        TripCompleteRequest request = new TripCompleteRequest();
        request.setFinalOdometer(150.0);
        request.setFuelConsumed(30.0);

        when(tripRepository.findByIdForUpdate(10L)).thenReturn(java.util.Optional.of(draftTrip));
        when(vehicleRepository.findByIdForUpdate(1L)).thenReturn(java.util.Optional.of(availableVehicle));
        when(driverRepository.findByIdForUpdate(1L)).thenReturn(java.util.Optional.of(validDriver));
        when(vehicleRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(driverRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(tripRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Trip result = tripService.complete(10L, request);

        assertThat(result.getStatus()).isEqualTo(TripStatus.COMPLETED);
        assertThat(availableVehicle.getStatus()).isEqualTo(VehicleStatus.AVAILABLE);
        assertThat(validDriver.getStatus()).isEqualTo(DriverStatus.AVAILABLE);
        assertThat(availableVehicle.getOdometer()).isEqualTo(150.0);
        verify(fuelIntelligenceService).evaluate(draftTrip);
    }

    @Test
    void complete_shouldThrow_whenTripNotDispatched() {
        when(tripRepository.findByIdForUpdate(10L)).thenReturn(java.util.Optional.of(draftTrip)); // still DRAFT

        assertThatThrownBy(() -> tripService.complete(10L, new TripCompleteRequest()))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Only Dispatched trips can be completed");
    }

    // ------------------------- cancel -------------------------

    @Test
    void cancel_shouldRestoreVehicleAndDriver_whenTripWasDispatched() {
        draftTrip.setStatus(TripStatus.DISPATCHED);
        availableVehicle.setStatus(VehicleStatus.ON_TRIP);
        validDriver.setStatus(DriverStatus.ON_TRIP);

        when(tripRepository.findByIdForUpdate(10L)).thenReturn(java.util.Optional.of(draftTrip));
        when(vehicleRepository.findByIdForUpdate(1L)).thenReturn(java.util.Optional.of(availableVehicle));
        when(driverRepository.findByIdForUpdate(1L)).thenReturn(java.util.Optional.of(validDriver));
        when(vehicleRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(driverRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(tripRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Trip result = tripService.cancel(10L);

        assertThat(result.getStatus()).isEqualTo(TripStatus.CANCELLED);
        assertThat(availableVehicle.getStatus()).isEqualTo(VehicleStatus.AVAILABLE);
        assertThat(validDriver.getStatus()).isEqualTo(DriverStatus.AVAILABLE);
    }

    @Test
    void cancel_shouldThrow_whenTripAlreadyCompleted() {
        draftTrip.setStatus(TripStatus.COMPLETED);
        when(tripRepository.findByIdForUpdate(10L)).thenReturn(java.util.Optional.of(draftTrip));

        assertThatThrownBy(() -> tripService.cancel(10L))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Only Draft or Dispatched trips can be cancelled");
    }
}
