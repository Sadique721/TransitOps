package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "invoices")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Invoice extends BaseEntity {
    private Long tripId;
    private String clientName;
    private BigDecimal amount;
    private BigDecimal tax;
    private BigDecimal total;
    private LocalDate dueDate;
    private String status; // e.g. DRAFT, SENT, PAID, OVERDUE
}
