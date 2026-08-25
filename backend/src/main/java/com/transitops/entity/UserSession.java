package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_sessions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserSession extends BaseEntity {
    private String ipAddress;
    private String userAgent;
    private String deviceToken;
    private LocalDateTime lastActive;
}
