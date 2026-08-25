package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cargo_manifests")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CargoManifest extends BaseEntity {
    private String manifestNumber;
    private BigDecimal declaredValue;
    private String carrierName;
}
