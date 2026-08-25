package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "trip_stops")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TripStop extends BaseEntity {
    private Long tripId;
    private Integer stopOrder;
    private String locationName;
    private Double lat;
    private Double lng;
    private String type; // e.g. PICKUP, DROP
    private String status; // e.g. PENDING, REACHED, SKIPPED
}
