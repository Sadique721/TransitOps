package com.transitops.service;

import com.transitops.dto.request.DriverRequest;
import com.transitops.entity.Driver;
import com.transitops.enums.DriverStatus;
import com.transitops.exception.BusinessRuleException;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository driverRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public Driver create(DriverRequest request) {
        if (driverRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new BusinessRuleException("License number already exists: " + request.getLicenseNumber());
        }

        Driver driver = Driver.builder()
                .name(request.getName())
                .licenseNumber(request.getLicenseNumber())
                .licenseCategory(request.getLicenseCategory())
                .licenseExpiryDate(request.getLicenseExpiryDate())
                .contactNumber(request.getContactNumber())
                .status(DriverStatus.AVAILABLE)
                .build();

        Driver saved = driverRepository.save(driver);
        auditLogService.log(null, "DRIVER_CREATED", "Drivers", saved.getId().toString(), null, saved.getLicenseNumber(), null);
        return saved;
    }

    public List<Driver> findAll(DriverStatus status) {
        return status != null ? driverRepository.findByStatus(status) : driverRepository.findAll();
    }

    public Driver findById(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found: " + id));
    }

    // Eligible for dispatch: Available status AND license not expired (PDF Rule #3)
    public List<Driver> findDispatchable() {
        return driverRepository.findByStatus(DriverStatus.AVAILABLE).stream()
                .filter(d -> d.getLicenseExpiryDate().isAfter(LocalDate.now()))
                .toList();
    }

    public List<Driver> findExpiringWithinDays(int days) {
        return driverRepository.findByLicenseExpiryDateBetween(LocalDate.now(), LocalDate.now().plusDays(days));
    }

    @Transactional
    public Driver update(Long id, DriverRequest request) {
        Driver driver = findById(id);

        if (!driver.getLicenseNumber().equals(request.getLicenseNumber())
                && driverRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new BusinessRuleException("License number already exists: " + request.getLicenseNumber());
        }

        driver.setName(request.getName());
        driver.setLicenseNumber(request.getLicenseNumber());
        driver.setLicenseCategory(request.getLicenseCategory());
        driver.setLicenseExpiryDate(request.getLicenseExpiryDate());
        driver.setContactNumber(request.getContactNumber());

        Driver saved = driverRepository.save(driver);
        auditLogService.log(null, "DRIVER_UPDATED", "Drivers", id.toString(), null, saved.getLicenseNumber(), null);
        return saved;
    }

    @Transactional
    public Driver changeStatus(Long id, DriverStatus newStatus) {
        Driver driver = findById(id);
        if (driver.getStatus() == DriverStatus.ON_TRIP) {
            throw new BusinessRuleException("Cannot manually change status of a driver who is On Trip");
        }
        DriverStatus old = driver.getStatus();
        driver.setStatus(newStatus);
        Driver saved = driverRepository.save(driver);
        auditLogService.log(null, "DRIVER_STATUS_CHANGED", "Drivers", id.toString(), old.name(), newStatus.name(), null);
        return saved;
    }

    @Transactional
    public void delete(Long id) {
        Driver driver = findById(id);
        if (driver.getStatus() == DriverStatus.ON_TRIP) {
            throw new BusinessRuleException("Cannot remove a driver who is currently On Trip");
        }
        driverRepository.delete(driver);
        auditLogService.log(null, "DRIVER_DELETED", "Drivers", id.toString(), driver.getLicenseNumber(), null, null);
    }
}
