package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "cargo_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CargoItem extends BaseEntity {
    private String name;
    private Double weight;
    private Double volume;
    private Boolean isFragile;
    private Boolean isDangerous;
    private String temperatureRange;
}
