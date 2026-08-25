package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "geofence_events")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GeofenceEvent extends BaseEntity {
    private Long geofenceId;
    private Long vehicleId;
    private LocalDateTime enteredAt;
    private LocalDateTime exitedAt;
    private String eventTriggerType; // e.g. ENTER, EXIT
}
