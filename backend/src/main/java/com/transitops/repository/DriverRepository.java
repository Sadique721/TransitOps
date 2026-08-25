package com.transitops.repository;

import com.transitops.entity.Driver;
import com.transitops.enums.DriverStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    boolean existsByLicenseNumber(String licenseNumber);
    List<Driver> findByStatus(DriverStatus status);
    List<Driver> findByLicenseExpiryDateBefore(LocalDate date);
    List<Driver> findByLicenseExpiryDateBetween(LocalDate start, LocalDate end);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("SELECT d FROM Driver d WHERE d.id = :id")
    java.util.Optional<Driver> findByIdForUpdate(@org.springframework.data.repository.query.Param("id") Long id);
}
