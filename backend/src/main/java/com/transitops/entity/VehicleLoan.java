package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "vehicle_loans")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VehicleLoan extends BaseEntity {
    private Long vehicleId;
    private String bankName;
    private BigDecimal emiAmount;
    private BigDecimal totalPaid;
    private BigDecimal remainingBalance;
}
