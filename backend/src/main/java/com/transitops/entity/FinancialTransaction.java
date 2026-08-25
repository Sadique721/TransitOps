package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "financial_transactions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FinancialTransaction extends BaseEntity {
    private String type; // e.g. DEBIT, CREDIT
    private BigDecimal amount;
    private String category;
}
