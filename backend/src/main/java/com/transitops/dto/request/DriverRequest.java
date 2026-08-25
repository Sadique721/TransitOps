package com.transitops.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DriverRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String licenseNumber;

    private String licenseCategory;

    @NotNull @Future
    private LocalDate licenseExpiryDate;

    private String contactNumber;
}
