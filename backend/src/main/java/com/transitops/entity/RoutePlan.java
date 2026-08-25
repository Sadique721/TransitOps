package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "route_plans")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RoutePlan extends BaseEntity {
    private Long tripId;
    private String plannedPolyline;
    private Double estimatedFuel;
    private BigDecimal tollCost;
}
