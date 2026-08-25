package com.transitops.dto.request;

import com.transitops.enums.VehicleStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VehicleStatusRequest {
    @NotNull
    private VehicleStatus status;
}
