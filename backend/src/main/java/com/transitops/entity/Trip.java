package com.transitops.entity;

import com.transitops.enums.TripStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Trip extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String tripNumber;

    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private Double cargoWeight; // kg

    private Double plannedDistance; // km

    private Double finalOdometer; // nullable until complete
    private Double fuelConsumed;   // liters, nullable until complete

    // --- Fuel Intelligence (Module 6, basic non-IoT version) ---
    private Double expectedFuelConsumed;   // liters, computed at completion time
    private Double fuelDeviationPercent;   // (actual - expected) / expected * 100
    @Builder.Default
    private Boolean fuelTheftSuspected = false;

    private BigDecimal revenue; // nullable, for ROI

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TripStatus status = TripStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    private LocalDateTime dispatchedAt;
    private LocalDateTime completedAt;

    @PrePersist
    @Override
    protected void onCreate() {
        super.onCreate();
        if (this.tripNumber == null) {
            this.tripNumber = "TR-" + System.currentTimeMillis() % 100000;
        }
    }
}
