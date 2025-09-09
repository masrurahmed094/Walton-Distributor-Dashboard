// =============================================================
// src/main/java/com/walton/sales/payload/request/UpdateProfileRequest.java
// MODIFIED: Removed username and password fields to make them immutable.
// =============================================================
package com.walton.sales.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {
    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Size(max = 100)
    @Email
    private String email;

    private String department;
    private String phone;
}
