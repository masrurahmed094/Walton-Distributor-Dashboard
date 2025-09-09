// =============================================================
// src/main/java/com/walton/sales/payload/request/LoginRequest.java
// =============================================================
package com.walton.sales.payload.request;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
public class LoginRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
}