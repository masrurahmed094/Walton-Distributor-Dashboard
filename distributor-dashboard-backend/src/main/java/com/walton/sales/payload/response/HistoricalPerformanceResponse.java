// =============================================================
// src/main/java/com/walton/sales/payload/response/HistoricalPerformanceResponse.java
// =============================================================
package com.walton.sales.payload.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class HistoricalPerformanceResponse {
    private String distributorCode;
    private String distributorName;
    private BigDecimal sales4MonthsAgo;
    private BigDecimal sales3MonthsAgo;
    private BigDecimal sales2MonthsAgo;
    private BigDecimal salesLastMonth;
}