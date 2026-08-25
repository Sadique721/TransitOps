package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "driver_documents")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DriverDocument extends BaseEntity {
    private Long driverId;
    private String fileUrl;
    private LocalDate expiryDate;
}
