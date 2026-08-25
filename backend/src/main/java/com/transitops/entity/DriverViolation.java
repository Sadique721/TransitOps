package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "driver_violations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DriverViolation extends BaseEntity {
    private Long driverId;
    private String violationType;
    private BigDecimal fineAmount;
    private LocalDate date;
}
