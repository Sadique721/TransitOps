package com.transitops.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class MaintenanceRequest {
    @NotNull
    private Long vehicleId;

    @NotBlank
    private String description;

    private BigDecimal cost;
    private LocalDate maintenanceDate;
}
