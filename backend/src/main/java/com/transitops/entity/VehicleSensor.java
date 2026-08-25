package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "vehicle_sensors")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VehicleSensor extends BaseEntity {
    private Long vehicleId;
    private String sensorType;
    private String serialNumber;
    private Double lastValue;
    private String status;
}
