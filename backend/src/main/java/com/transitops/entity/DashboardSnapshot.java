package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "dashboard_snapshots")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardSnapshot extends BaseEntity {
    private LocalDate snapshotDate;
    private String kpisJson;
}
