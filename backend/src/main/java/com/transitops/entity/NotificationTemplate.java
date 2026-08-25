package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "notification_templates")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NotificationTemplate extends BaseEntity {
    private String type; // e.g. TRIP_DISPATCHED, DOCUMENT_EXPIRY
    private String subject;
    private String body;
}
