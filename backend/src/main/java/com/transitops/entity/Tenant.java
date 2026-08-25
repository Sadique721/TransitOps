package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "tenants")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Tenant extends BaseEntity {
    private String name;
    private String subdomain;
    private String configs; // JSON format configuration
    private String status;  // e.g. ACTIVE, SUSPENDED
}
