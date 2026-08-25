package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "stock_transfers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StockTransfer extends BaseEntity {
    private Long sourceWarehouseId;
    private Long destWarehouseId;
    private Long cargoItemId;
    private Integer quantity;
    private String status; // e.g. PENDING, IN_TRANSIT, COMPLETED
}
