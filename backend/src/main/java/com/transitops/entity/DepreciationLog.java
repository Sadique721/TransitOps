package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "depreciation_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DepreciationLog extends BaseEntity {
    private Long vehicleId;
    private BigDecimal amount;
    private LocalDate depreciationDate;
}
