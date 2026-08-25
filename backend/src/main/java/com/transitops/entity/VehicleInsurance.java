package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "vehicle_insurance")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VehicleInsurance extends BaseEntity {
    private Long vehicleId;
    private String policyNumber;
    private String provider;
    private BigDecimal cost;
    private LocalDate startDate;
    private LocalDate endDate;
}
