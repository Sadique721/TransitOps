package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "maintenance_checklists")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MaintenanceChecklist extends BaseEntity {
    private Long maintenanceLogId;
    private String taskDescription;
    private Boolean isRequired;
}
