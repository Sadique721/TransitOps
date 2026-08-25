package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "financial_accounts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FinancialAccount extends BaseEntity {
    private String accountName;
    private BigDecimal balance;
}
