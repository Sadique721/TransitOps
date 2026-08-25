package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "geofences")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Geofence extends BaseEntity {
    private String name;
    private Double centerLat;
    private Double centerLng;
    private Double radiusMeters;
}
