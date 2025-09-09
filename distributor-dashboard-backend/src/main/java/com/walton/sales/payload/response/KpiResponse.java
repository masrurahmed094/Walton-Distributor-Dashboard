// =============================================================
// src/main/java/com/walton/sales/payload/response/KpiResponse.java
// =============================================================
package com.walton.sales.payload.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class KpiResponse {
    private String distributorCode;
    private String distributorName;
    private BigDecimal amount;
}