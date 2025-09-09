// =============================================================
// src/main/java/com/walton/sales/payload/request/ResetPasswordRequest.java
// NEW FILE
// =============================================================
package com.walton.sales.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String securityAnswer;

    @NotBlank
    @Size(min = 6, max = 40)
    private String newPassword;
}