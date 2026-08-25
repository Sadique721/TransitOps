package com.transitops.repository;

import com.transitops.entity.Trip;
import com.transitops.enums.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {

    // MEDIUM FIX (N+1): FuelIntelligenceService/DriverPerformanceService/
    // VehicleHealthService all call these in loops and then read
    // trip.getVehicle()/trip.getDriver(). Without JOIN FETCH, each trip in the
    // returned list triggers a separate lazy-load query per association
    // (classic N+1). JOIN FETCH pulls vehicle + driver back in the same query.
    @Query("SELECT t FROM Trip t JOIN FETCH t.vehicle JOIN FETCH t.driver WHERE t.status = :status")
    List<Trip> findByStatus(TripStatus status);

    @Query("SELECT t FROM Trip t JOIN FETCH t.vehicle JOIN FETCH t.driver WHERE t.vehicle.id = :vehicleId")
    List<Trip> findByVehicleId(Long vehicleId);

    @Query("SELECT t FROM Trip t JOIN FETCH t.vehicle JOIN FETCH t.driver WHERE t.driver.id = :driverId")
    List<Trip> findByDriverId(Long driverId);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM Trip t WHERE t.id = :id")
    java.util.Optional<Trip> findByIdForUpdate(@org.springframework.data.repository.query.Param("id") Long id);
}
