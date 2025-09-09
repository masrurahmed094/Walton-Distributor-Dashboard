// =============================================================
// src/main/java/com/walton/sales/payload/request/RegisterRequest.java
// MODIFIED: Added new fields for registration.
// =============================================================
package com.walton.sales.payload.request;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
    
    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Size(max = 100)
    @Email
    private String email;

    private String department;
    private String phone;
    
    @NotBlank
    private String securityQuestion;
    
    @NotBlank
    private String securityAnswer;
}