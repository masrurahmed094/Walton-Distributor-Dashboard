// =============================================================
// src/main/java/com/walton/sales/SalesDashboardBackendApplication.java
// =============================================================
package com.walton.sales;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// MODIFIED: Removed @ConfigurationPropertiesScan as it's not needed with the new config pattern
@SpringBootApplication
public class SalesDashboardBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(SalesDashboardBackendApplication.class, args);
    }
}