package com.transitops.entity;

import com.transitops.enums.DriverStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "drivers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Driver extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String licenseNumber;

    private String licenseCategory;

    @Column(nullable = false)
    private LocalDate licenseExpiryDate;

    private String contactNumber;

    @Builder.Default
    private Integer safetyScore = 100;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private DriverStatus status = DriverStatus.AVAILABLE;
}
