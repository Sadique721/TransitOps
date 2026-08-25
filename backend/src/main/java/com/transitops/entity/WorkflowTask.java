package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "workflow_tasks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkflowTask extends BaseEntity {
    private String taskType; // e.g. EXPENSE_APPROVAL, TRIP_CANCELLATION
    private String description;
    private String status; // PENDING, APPROVED, REJECTED
    private String assignedToRole; // e.g. FLEET_MANAGER
}
