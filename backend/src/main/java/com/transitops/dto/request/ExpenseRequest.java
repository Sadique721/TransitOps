package com.transitops.dto.request;

import com.transitops.enums.ExpenseType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExpenseRequest {
    private Long tripId; // nullable

    @NotNull
    private Long vehicleId;

    @NotNull
    private ExpenseType type;

    private Double liters;

    @NotNull
    private BigDecimal cost;

    private LocalDate date;
}
