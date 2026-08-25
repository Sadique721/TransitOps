package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "docks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DockManagement extends BaseEntity {
    private Long warehouseId;
    private String dockNumber;
    private Boolean isOccupied;
    private LocalDateTime occupiedUntil;
}
