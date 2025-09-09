// =============================================================
// src/main/java/com/walton/sales/payload/response/JwtResponse.java
// =============================================================
package com.walton.sales.payload.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtResponse {
    private String token;
    private String type = "Bearer";

    public JwtResponse(String accessToken) {
        this.token = accessToken;
    }
}