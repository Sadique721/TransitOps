package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trip_attachments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TripAttachment extends BaseEntity {
    private Long tripId;
    private String fileUrl;
    private LocalDateTime uploadedAt;
}
