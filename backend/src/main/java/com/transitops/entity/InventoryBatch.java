package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "inventory_batches")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InventoryBatch extends BaseEntity {
    private Long warehouseId;
    private Long cargoItemId;
    private Integer quantity;
    private String storageBay;
    private LocalDate lastAudited;
}
