// =============================================================
// src/main/java/com/walton/sales/payload/response/SrPerformanceResponse.java
// =============================================================
package com.walton.sales.payload.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class SrPerformanceResponse {
    private String dbCode;
    private String dbName;
    private String userName;
    private String userId;
    private BigDecimal totalInvoicedAmount;
}