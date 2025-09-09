// =============================================================
// src/main/java/com/walton/sales/service/DashboardService.java
// =============================================================
package com.walton.sales.service;

import com.walton.sales.payload.response.*;
import com.walton.sales.repository.genfmcg.DashboardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DashboardService {

    @Autowired
    private DashboardRepository repo;

    public Optional<KpiResponse> getLiftingTarget(String code, LocalDate start, LocalDate end) {
        return repo.findKpiAmountByDateRange(DashboardRepository.LIFTING_TARGET_QUERY, code, start, end);
    }
    public Optional<KpiResponse> getPurchaseAmount(String code, LocalDate start, LocalDate end) {
        return repo.findKpiAmountByDateRange(DashboardRepository.PURCHASE_AMOUNT_QUERY, code, start, end);
    }
    public Optional<KpiResponse> getImsTarget(String code, LocalDate start, LocalDate end) {
        return repo.findKpiAmountByDateRange(DashboardRepository.IMS_TARGET_QUERY, code, start, end);
    }
    public Optional<KpiResponse> getImsInvoicedAmount(String code) {
        return repo.findKpiAmountStatic(DashboardRepository.IMS_INVOICED_QUERY, code);
    }
    public Optional<KpiResponse> getMonthlyCollection(String code, LocalDate start, LocalDate end) {
        return repo.findKpiAmountByDateRange(DashboardRepository.MONTHLY_COLLECTION_QUERY, code, start, end);
    }
    public Optional<KpiResponse> getPrimaryOrderValue(String code, LocalDate start, LocalDate end) {
        return repo.findKpiAmountByDateRange(DashboardRepository.PRIMARY_ORDER_VALUE_QUERY, code, start, end);
    }
    public Optional<KpiResponse> getTotalActiveCustomers(String code) {
        return repo.findKpiAmountStatic(DashboardRepository.TOTAL_ACTIVE_CUSTOMERS_QUERY, code);
    }
    public Optional<KpiResponse> getTotalInvoicedCustomers(String code) {
        return repo.findKpiAmountStatic(DashboardRepository.TOTAL_INVOICED_CUSTOMERS_QUERY, code);
    }
    public Optional<KpiResponse> getSecondaryOrderValue(String code, LocalDate start, LocalDate end) {
        return repo.findKpiAmountByDateRange(DashboardRepository.SECONDARY_ORDER_VALUE_QUERY, code, start, end);
    }
    public Optional<KpiResponse> getCurrentStockValue(String code) {
        return repo.findKpiAmountStatic(DashboardRepository.CURRENT_STOCK_VALUE_QUERY, code);
    }
    public List<HistoricalPerformanceResponse> getHistoricalPerformance(String code) {
        return repo.findHistoricalPerformance(code);
    }
    public List<SrPerformanceResponse> getSrPerformance(String code) {
        return repo.findSrPerformance(code);
    }
    public List<DistributorReportResponse> getDistributorReport(String code, LocalDate start, LocalDate end) {
        return repo.findDistributorReport(code, start, end);
    }
    public List<DistributorResponse> getDistributorList() {
        return repo.findAllDistributors();
    }
}
