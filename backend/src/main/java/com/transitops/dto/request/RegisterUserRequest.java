package com.transitops.dto.request;

import com.transitops.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterUserRequest {
    @NotBlank
    private String name;

    @NotBlank @Email
    private String email;

    @NotBlank
    private String password;

    @NotNull
    private Role role;
}
