package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "warehouses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Warehouse extends BaseEntity {
    private String name;
    private Double lat;
    private Double lng;
    private String address;
    private Double totalCapacity;
}
