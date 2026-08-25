package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification extends BaseEntity {
    private String channel; // e.g. SMS, EMAIL, PUSH, WEBSOCKET
    private String title;
    private String body;
    private String status; // e.g. PENDING, SENT, FAILED
    private LocalDateTime sentAt;
}
