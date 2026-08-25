package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "driver_attendance")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DriverAttendance extends BaseEntity {
    private Long driverId;
    private LocalDate date;
    private LocalTime checkIn;
    private LocalTime checkOut;
    private Double gpsLat;
    private Double gpsLng;
}
