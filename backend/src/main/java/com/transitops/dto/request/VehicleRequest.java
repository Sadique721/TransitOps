package com.transitops.dto.request;

import com.transitops.enums.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class VehicleRequest {
    @NotBlank
    private String registrationNumber;

    @NotBlank
    private String name;

    private String model;

    @NotNull
    private VehicleType type;

    @NotNull @Positive
    private Double maxLoadCapacity;

    private Double odometer;
    private BigDecimal acquisitionCost;
    private String region;
}
