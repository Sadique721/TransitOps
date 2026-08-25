package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "driver_training")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DriverTraining extends BaseEntity {
    private Long driverId;
    private String courseName;
    private LocalDate completionDate;
    private LocalDate expiryDate;
}
