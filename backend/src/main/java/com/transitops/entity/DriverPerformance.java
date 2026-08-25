package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "driver_performance")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DriverPerformance extends BaseEntity {
    private Long driverId;
    private Integer harshBrakes;
    private Integer overSpeedCount;
    private Long idleTimeSeconds;
    private Double nightDriveHours;
}
