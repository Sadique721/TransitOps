package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "vehicle_health_scores")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VehicleHealthScore extends BaseEntity {
    private Long vehicleId;
    private Double overallScore;
    private Double engineScore;
    private Double tyreScore;
    private Double batteryScore;
    private Double brakeScore;
}
