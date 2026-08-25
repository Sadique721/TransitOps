package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "vendors")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Vendor extends BaseEntity {
    private String name;
    private String type; // e.g. FUEL, REPAIR
    private BigDecimal outstandingBalance;
}
