package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "vendor_payments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VendorPayment extends BaseEntity {
    private Long vendorId;
    private BigDecimal amount;
    private String paymentMethod;
    private LocalDate date;
}
