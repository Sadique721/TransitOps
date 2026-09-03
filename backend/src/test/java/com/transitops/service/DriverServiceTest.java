package com.transitops.service;

import com.transitops.dto.request.DriverRequest;
import com.transitops.entity.Driver;
import com.transitops.enums.DriverStatus;
import com.transitops.exception.BusinessRuleException;
import com.transitops.repository.DriverRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DriverServiceTest {

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private DriverService driverService;

    private Driver sampleDriver;
    private DriverRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleDriver = Driver.builder()
                .name("Ramesh Kumar")
                .licenseNumber("DL-142024001928")
                .licenseCategory("Heavy Commercial")
                .licenseExpiryDate(LocalDate.now().plusMonths(6))
                .contactNumber("+91 9876543210")
                .status(DriverStatus.AVAILABLE)
                .safetyScore(95)
                .build();
        sampleDriver.setId(1L);

        sampleRequest = new DriverRequest();
        sampleRequest.setName("Ramesh Kumar");
        sampleRequest.setLicenseNumber("DL-142024001928");
        sampleRequest.setLicenseCategory("Heavy Commercial");
        sampleRequest.setLicenseExpiryDate(LocalDate.now().plusMonths(6));
        sampleRequest.setContactNumber("+91 9876543210");
    }

    @Test
    @DisplayName("White-Box: Creating a driver with valid unique license succeeds")
    void testCreateDriver_Success() {
        when(driverRepository.existsByLicenseNumber("DL-142024001928")).thenReturn(false);
        when(driverRepository.save(any(Driver.class))).thenReturn(sampleDriver);

        Driver created = driverService.create(sampleRequest);

        assertThat(created).isNotNull();
        assertThat(created.getName()).isEqualTo("Ramesh Kumar");
        assertThat(created.getStatus()).isEqualTo(DriverStatus.AVAILABLE);
        verify(auditLogService, times(1)).log(any(), eq("DRIVER_CREATED"), eq("Drivers"), eq("1"), any(), eq("DL-142024001928"), any());
    }

    @Test
    @DisplayName("White-Box: Creating a driver with duplicate license throws BusinessRuleException")
    void testCreateDriver_DuplicateLicense_ThrowsException() {
        when(driverRepository.existsByLicenseNumber("DL-142024001928")).thenReturn(true);

        assertThatThrownBy(() -> driverService.create(sampleRequest))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("License number already exists");

        verify(driverRepository, never()).save(any());
    }

    @Test
    @DisplayName("White-Box: findDispatchable filters out drivers with expired licenses")
    void testFindDispatchable_FiltersExpired() {
        Driver validDriver = sampleDriver;
        Driver expiredDriver = Driver.builder()
                .name("Old Driver")
                .licenseNumber("DL-OLD-999")
                .licenseExpiryDate(LocalDate.now().minusDays(5)) // Expired!
                .status(DriverStatus.AVAILABLE)
                .build();
        expiredDriver.setId(2L);

        when(driverRepository.findByStatus(DriverStatus.AVAILABLE)).thenReturn(List.of(validDriver, expiredDriver));

        List<Driver> dispatchable = driverService.findDispatchable();

        assertThat(dispatchable).hasSize(1);
        assertThat(dispatchable.get(0).getName()).isEqualTo("Ramesh Kumar");
    }
}
