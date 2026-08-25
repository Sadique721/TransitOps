package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dock_queues")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DockQueue extends BaseEntity {
    private Long dockId;
    private Long vehicleId;
    private Integer priority;
    private LocalDateTime scheduledTime;
}
