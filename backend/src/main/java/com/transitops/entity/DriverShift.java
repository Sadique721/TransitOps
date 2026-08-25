package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.time.LocalTime;

@Entity
@Table(name = "driver_shifts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DriverShift extends BaseEntity {
    private Long driverId;
    private LocalTime shiftStart;
    private LocalTime shiftEnd;
    private String daysOfWeek; // e.g. "MONDAY,TUESDAY"
}
