package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "vehicle_documents")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VehicleDocument extends BaseEntity {
    private Long vehicleId;
    private String documentType;
    private String fileUrl;
    private LocalDate expiryDate;
}
