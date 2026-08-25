package com.transitops.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog extends BaseEntity {

    private Long userId;

    @Column(nullable = false)
    private String action; // e.g., TRIP_DISPATCHED, VEHICLE_CREATED

    private String entityName; // e.g., Trips
    private String entityId;

    @Column(columnDefinition = "TEXT")
    private String oldValue; // JSON string

    @Column(columnDefinition = "TEXT")
    private String newValue; // JSON string

    private String ipAddress;
}
