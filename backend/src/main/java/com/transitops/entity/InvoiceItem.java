package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "invoice_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InvoiceItem extends BaseEntity {
    private Long invoiceId;
    private String description;
    private Double quantity;
    private BigDecimal rate;
    private BigDecimal amount;
}
