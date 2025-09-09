package com.walton.sales.controller;

import com.walton.sales.payload.response.DistributorReportResponse;
import com.walton.sales.payload.response.HistoricalPerformanceResponse;
import com.walton.sales.payload.response.SrPerformanceResponse;
import com.walton.sales.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@PreAuthorize("isAuthenticated()")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/distributors")
    public ResponseEntity<?> getDistributorList() {
        return ResponseEntity.ok(dashboardService.getDistributorList());
    }

    @GetMapping("/history")
    // FIX: Re-added @RequestParam to match the DashboardService method signature.
    public ResponseEntity<?> getHistoricalData(@RequestParam String distributorCode) {
        // FIX: Pass the distributorCode to the service method to resolve the error.
        List<HistoricalPerformanceResponse> data = dashboardService.getHistoricalPerformance(distributorCode);
        return data.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(data);
    }

    @GetMapping("/sr-performance")
    public ResponseEntity<?> getSrPerformance(@RequestParam String distributorCode) {
        List<SrPerformanceResponse> data = dashboardService.getSrPerformance(distributorCode);
        return data.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(data);
    }

    @GetMapping("/distributor-report")
    public ResponseEntity<?> getDistributorReport(
            @RequestParam String distributorCode,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<DistributorReportResponse> data = dashboardService.getDistributorReport(distributorCode, startDate, endDate);
        return data.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(data);
    }

    // --- KPI Endpoints (No changes needed) ---
    
    @GetMapping("/kpis/lifting-target")
    public ResponseEntity<?> getLiftingTarget(
            @RequestParam String distributorCode,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return dashboardService.getLiftingTarget(distributorCode, startDate, endDate)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/kpis/purchase-amount")
    public ResponseEntity<?> getPurchaseAmount(
            @RequestParam String distributorCode,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return dashboardService.getPurchaseAmount(distributorCode, startDate, endDate)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/kpis/ims-target")
    public ResponseEntity<?> getImsTarget(
            @RequestParam String distributorCode,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return dashboardService.getImsTarget(distributorCode, startDate, endDate)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/kpis/ims-invoiced")
    public ResponseEntity<?> getImsInvoiced(@RequestParam String distributorCode) {
        return dashboardService.getImsInvoicedAmount(distributorCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/kpis/monthly-collection")
    public ResponseEntity<?> getMonthlyCollection(
            @RequestParam String distributorCode,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return dashboardService.getMonthlyCollection(distributorCode, startDate, endDate)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/kpis/primary-order")
    public ResponseEntity<?> getPrimaryOrder(
            @RequestParam String distributorCode,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return dashboardService.getPrimaryOrderValue(distributorCode, startDate, endDate)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/kpis/total-active-customers")
    public ResponseEntity<?> getTotalActiveCustomers(@RequestParam String distributorCode) {
        return dashboardService.getTotalActiveCustomers(distributorCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/kpis/total-invoiced-customers")
    public ResponseEntity<?> getTotalInvoicedCustomers(@RequestParam String distributorCode) {
        return dashboardService.getTotalInvoicedCustomers(distributorCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/kpis/secondary-order")
    public ResponseEntity<?> getSecondaryOrder(
            @RequestParam String distributorCode,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return dashboardService.getSecondaryOrderValue(distributorCode, startDate, endDate)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/kpis/current-stock")
    public ResponseEntity<?> getCurrentStock(@RequestParam String distributorCode) {
        return dashboardService.getCurrentStockValue(distributorCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}