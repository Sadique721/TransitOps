package com.transitops.entity;

import com.transitops.enums.VehicleStatus;
import com.transitops.enums.VehicleType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Vehicle extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String registrationNumber;

    @Column(nullable = false)
    private String name;

    private String model;

    @Enumerated(EnumType.STRING)
    private VehicleType type;

    @Column(nullable = false)
    private Double maxLoadCapacity; // kg

    @Builder.Default
    private Double odometer = 0.0; // km

    private BigDecimal acquisitionCost;

    @Column(unique = true)
    private String qrCode;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VehicleStatus status = VehicleStatus.AVAILABLE;

    private String region;

    @PrePersist
    @Override
    protected void onCreate() {
        super.onCreate();
        if (this.qrCode == null) {
            this.qrCode = "VEH-QR-" + System.currentTimeMillis();
        }
    }
}
