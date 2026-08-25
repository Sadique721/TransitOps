package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "webhooks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Webhook extends BaseEntity {
    private String url;
    private String events; // comma-separated events, e.g. "trip.completed,vehicle.maintenance"
    private Boolean isActive;
}
