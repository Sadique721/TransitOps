package com.transitops.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "maintenance_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MaintenanceLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(nullable = false)
    private String description; // e.g., "Oil Change"

    private BigDecimal cost;

    private LocalDate maintenanceDate;

    @Builder.Default
    private Boolean isActive = true; // true = vehicle currently In Shop
}
