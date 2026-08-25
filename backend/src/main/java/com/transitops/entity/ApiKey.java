package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "api_keys")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ApiKey extends BaseEntity {
    private String keyValue;
    private String description;
    private LocalDate expiryDate;
}
