package com.transitops.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TripCompleteRequest {
    @NotNull @Positive
    private Double finalOdometer;

    @NotNull @Positive
    private Double fuelConsumed;
}
