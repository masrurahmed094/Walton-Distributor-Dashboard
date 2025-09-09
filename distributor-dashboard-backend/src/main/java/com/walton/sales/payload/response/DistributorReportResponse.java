// =============================================================
// src/main/java/com/walton/sales/payload/response/DistributorReportResponse.java
// =============================================================
package com.walton.sales.payload.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DistributorReportResponse {
    private String name;
    private BigDecimal totalSalesAmount;
    private BigDecimal totalCollectionAmount;
    private BigDecimal durationDue;
}