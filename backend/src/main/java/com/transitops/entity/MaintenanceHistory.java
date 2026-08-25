package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "maintenance_history")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MaintenanceHistory extends BaseEntity {
    private Long vehicleId;
    private String partReplaced;
    private String mechanicName;
    private Double durationHours;
}
