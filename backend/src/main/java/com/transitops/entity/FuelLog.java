package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "fuel_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FuelLog extends BaseEntity {
    private Long vehicleId;
    private String fuelStation;
    private Double liters;
    private BigDecimal costPerLiter;
    private BigDecimal totalCost;
    private Double odometerReading;
    private Boolean isTheftSuspected;
}
