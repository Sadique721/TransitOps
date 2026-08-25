package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fuel_cards")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FuelCard extends BaseEntity {
    private String cardNumber;
    private String provider;
    private LocalDate expiry;
    private BigDecimal limitAmount;
}
