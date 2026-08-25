package com.transitops.repository;

import com.transitops.entity.Vehicle;
import com.transitops.enums.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    boolean existsByRegistrationNumber(String registrationNumber);
    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);
    List<Vehicle> findByStatus(VehicleStatus status);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("SELECT v FROM Vehicle v WHERE v.id = :id")
    java.util.Optional<Vehicle> findByIdForUpdate(@org.springframework.data.repository.query.Param("id") Long id);
}
