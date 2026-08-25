package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trip_timeline")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TripTimeline extends BaseEntity {
    private Long tripId;
    private String previousStatus;
    private String newStatus;
    private LocalDateTime timestamp;
}
