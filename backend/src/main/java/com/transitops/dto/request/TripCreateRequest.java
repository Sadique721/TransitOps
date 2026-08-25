package com.transitops.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TripCreateRequest {
    @NotBlank
    private String source;

    @NotBlank
    private String destination;

    @NotNull @Positive
    private Double cargoWeight;

    private Double plannedDistance;

    @NotNull
    private Long vehicleId;

    @NotNull
    private Long driverId;
}
