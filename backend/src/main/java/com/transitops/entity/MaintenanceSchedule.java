package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "maintenance_schedules")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MaintenanceSchedule extends BaseEntity {
    private Long vehicleId;
    private String serviceType;
    private Double mileageInterval;
    private Integer timeIntervalDays;
}
