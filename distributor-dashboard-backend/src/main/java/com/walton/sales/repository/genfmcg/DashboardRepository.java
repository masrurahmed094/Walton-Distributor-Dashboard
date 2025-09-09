// =============================================================
// src/main/java/com/walton/sales/repository/genfmcg/DashboardRepository.java
// =============================================================
package com.walton.sales.repository.genfmcg;

import com.walton.sales.payload.response.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class DashboardRepository {

    private final JdbcTemplate jdbcTemplate;

    public DashboardRepository(@Qualifier("genFmcgJdbcTemplate") JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // --- Query Definitions ---
    public static final String LIFTING_TARGET_QUERY = "SELECT d.code, d.NAME, st.amount AS total_amount FROM sales_target st JOIN distributor_markets dm ON st.market_id = dm.market_id JOIN distributors d ON dm.distributor_id = d.ID WHERE d.code = ? AND DATE(CONCAT(st.YEAR, '-', st.MONTH, '-01')) BETWEEN ? AND ?;";
    public static final String PURCHASE_AMOUNT_QUERY = "SELECT d.code, d.NAME, SUM(ddc.total_do_amount) AS total_amount FROM distributor_delivery_challans ddc JOIN distributors d ON d.ID = ddc.distributor_id WHERE ddc.delivered_at >= ? AND ddc.delivered_at <= ? AND d.code = ? GROUP BY d.code, d.NAME;";
    public static final String IMS_TARGET_QUERY = "SELECT d.code, d.NAME, SUM(st.amount) AS total_amount FROM sales_target st JOIN distributor_markets dm ON st.market_id = dm.market_id JOIN distributors d ON dm.distributor_id = d.ID WHERE d.code = ? AND DATE(CONCAT(st.YEAR, '-', LPAD(st.MONTH :: TEXT, 2, '0'), '-01')) BETWEEN ? AND ? GROUP BY d.code, d.NAME;";
    public static final String IMS_INVOICED_QUERY = "SELECT d.code, d.NAME, ROUND(CAST(SUM(ci.total_amount) AS NUMERIC), 2) AS total_amount FROM customer_invoices AS ci JOIN distributors AS d ON d.ID = ci.distributor_id WHERE d.code = ? AND ci.invoiced_date BETWEEN DATE_TRUNC('month', CURRENT_DATE) AND CURRENT_DATE GROUP BY d.code, d.NAME;";
    public static final String MONTHLY_COLLECTION_QUERY = "SELECT d.code, d.NAME, SUM(cp.amount) AS total_amount FROM customer_payments cp JOIN distributors d ON d.ID = cp.distributor_id WHERE d.code = ? AND cp.collection_time BETWEEN ? AND ? GROUP BY d.code, d.NAME;";
    public static final String PRIMARY_ORDER_VALUE_QUERY = "SELECT d.code, d.NAME, SUM(dp.amount) AS total_amount FROM distributor_payments AS dp JOIN distributors AS d ON d.ID = dp.distributor_id WHERE d.code = ? AND dp.collection_time BETWEEN ? AND ? GROUP BY d.code, d.NAME;";
    public static final String TOTAL_ACTIVE_CUSTOMERS_QUERY = "SELECT d.code, d.NAME, COUNT(DISTINCT C.ID) AS total_amount FROM distributors AS d JOIN customer_distributors AS cd ON d.ID = cd.distributor_id JOIN customers AS C ON cd.customer_id = C.ID WHERE d.code = ? AND C.is_active = TRUE GROUP BY d.code, d.NAME;";
    public static final String TOTAL_INVOICED_CUSTOMERS_QUERY = "SELECT d.code, d.NAME, COUNT(DISTINCT ci.customer_id) AS total_amount FROM customer_invoices AS ci JOIN distributors AS d ON d.ID = ci.distributor_id WHERE d.code = ? AND ci.invoiced_date BETWEEN DATE_TRUNC('month', CURRENT_DATE) AND CURRENT_DATE GROUP BY d.code, d.NAME;";
    public static final String SECONDARY_ORDER_VALUE_QUERY = "WITH customer_order AS (SELECT DISTINCT so.ID AS order_id, so.code AS order_code, so.order_date, C.code AS customer_code, C.NAME AS customer_name, so.total_amount AS order_total, d.code, d.NAME FROM secondary_orders so JOIN distributors d ON d.ID = so.distributor_id JOIN customers C ON C.ID = so.customer_id WHERE d.code = ? AND so.order_date BETWEEN ? AND ?) SELECT code, name, ROUND(SUM(order_total) :: NUMERIC, 2) AS total_amount FROM customer_order GROUP BY code, name;";
    public static final String CURRENT_STOCK_VALUE_QUERY = "SELECT d.code, d.NAME, ROUND(CAST(SUM(ds.quantity * (P.trade_price - (P.trade_price * P.default_discount_for_distributor / 100.0))) AS NUMERIC), 2) AS total_amount FROM distributor_stocks ds JOIN distributors d ON d.ID = ds.distributor_id JOIN products P ON P.ID = ds.product_id WHERE d.code = ? GROUP BY d.code, d.NAME;";
    public static final String HISTORICAL_PERFORMANCE_QUERY = "SELECT d.code AS distributor_code, d.name AS distributor_name, SUM(CASE WHEN ci.invoiced_date BETWEEN DATE_TRUNC('month', CURRENT_DATE - INTERVAL '4 months') AND (DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 months') - INTERVAL '1 second') THEN ci.total_amount ELSE 0 END) AS sales_4_months_ago, SUM(CASE WHEN ci.invoiced_date BETWEEN DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 months') AND (DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 months') - INTERVAL '1 second') THEN ci.total_amount ELSE 0 END) AS sales_3_months_ago, SUM(CASE WHEN ci.invoiced_date BETWEEN DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 months') AND (DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') - INTERVAL '1 second') THEN ci.total_amount ELSE 0 END) AS sales_2_months_ago, SUM(CASE WHEN ci.invoiced_date BETWEEN DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') AND (DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 second') THEN ci.total_amount ELSE 0 END) AS sales_last_month FROM distributors d JOIN customer_invoices ci ON d.ID = ci.distributor_id WHERE d.code = ? AND ci.invoiced_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '4 months') GROUP BY d.code, d.name ORDER BY d.code;";
    public static final String SR_PERFORMANCE_QUERY = "SELECT d.code AS db_code, d.NAME AS distributor_name, u.NAME AS User_name, u.code AS user_id, SUM(ci.total_amount) AS total_invoiced_amount FROM customer_invoices AS ci JOIN secondary_orders so ON so.ID = ci.order_id JOIN distributors AS d ON d.ID = ci.distributor_id JOIN users u ON u.ID = so.created_by WHERE d.code = ? AND ci.invoiced_date BETWEEN DATE_TRUNC('month', CURRENT_DATE) AND CURRENT_DATE GROUP BY d.code, d.NAME, u.NAME, u.code;";
    public static final String DISTRIBUTOR_REPORT_QUERY = "SELECT C.NAME, SUM(ci.total_amount) AS total_sales_amount, SUM(cp.amount) AS total_collection_amount, (SUM(ci.total_amount) - SUM(cp.amount)) AS duration_due FROM customer_invoices AS ci JOIN customers C ON C.ID = ci.customer_id JOIN distributors AS d ON d.ID = ci.distributor_id JOIN customer_payments cp ON cp.customer_id = C.ID WHERE d.code = ? AND ci.invoiced_date BETWEEN ? AND ? AND cp.collection_time BETWEEN ? AND ? GROUP BY C.NAME, C.code;";
    public static final String DISTRIBUTOR_LIST_QUERY = "SELECT code, name FROM distributors ORDER BY name;";

    // --- Repository Methods ---

    public Optional<KpiResponse> findKpiAmountByDateRange(String sql, String distributorCode, LocalDate startDate, LocalDate endDate) {
        try {
            Object[] params;
             if (sql.equals(PURCHASE_AMOUNT_QUERY)) {
                 params = new Object[]{startDate, endDate, distributorCode};
            } else {
                 params = new Object[]{distributorCode, startDate, endDate};
            }
            KpiResponse result = jdbcTemplate.queryForObject(sql, new KpiResponseMapper(), params);
            return Optional.ofNullable(result);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<KpiResponse> findKpiAmountStatic(String sql, String distributorCode) {
        try {
            KpiResponse result = jdbcTemplate.queryForObject(sql, new KpiResponseMapper(), distributorCode);
            return Optional.ofNullable(result);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }
    
    public List<HistoricalPerformanceResponse> findHistoricalPerformance(String distributorCode) {
        return jdbcTemplate.query(HISTORICAL_PERFORMANCE_QUERY, new HistoricalPerformanceMapper(), distributorCode);
    }

    public List<SrPerformanceResponse> findSrPerformance(String distributorCode) {
        return jdbcTemplate.query(SR_PERFORMANCE_QUERY, new SrPerformanceMapper(), distributorCode);
    }

    public List<DistributorReportResponse> findDistributorReport(String distributorCode, LocalDate startDate, LocalDate endDate) {
        return jdbcTemplate.query(DISTRIBUTOR_REPORT_QUERY, new DistributorReportMapper(), distributorCode, startDate, endDate, startDate, endDate);
    }

    public List<DistributorResponse> findAllDistributors() {
        return jdbcTemplate.query(DISTRIBUTOR_LIST_QUERY, new DistributorMapper());
    }

    // --- Row Mappers ---

    private static class KpiResponseMapper implements RowMapper<KpiResponse> {
        @Override
        public KpiResponse mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
            KpiResponse dto = new KpiResponse();
            dto.setDistributorCode(rs.getString("code"));
            dto.setDistributorName(rs.getString("name"));
            dto.setAmount(rs.getBigDecimal("total_amount"));
            return dto;
        }
    }

    private static class HistoricalPerformanceMapper implements RowMapper<HistoricalPerformanceResponse> {
        @Override
        public HistoricalPerformanceResponse mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
            HistoricalPerformanceResponse dto = new HistoricalPerformanceResponse();
            dto.setDistributorCode(rs.getString("distributor_code"));
            dto.setDistributorName(rs.getString("distributor_name"));
            dto.setSales4MonthsAgo(rs.getBigDecimal("sales_4_months_ago"));
            dto.setSales3MonthsAgo(rs.getBigDecimal("sales_3_months_ago"));
            dto.setSales2MonthsAgo(rs.getBigDecimal("sales_2_months_ago"));
            dto.setSalesLastMonth(rs.getBigDecimal("sales_last_month"));
            return dto;
        }
    }

    private static class SrPerformanceMapper implements RowMapper<SrPerformanceResponse> {
        @Override
        public SrPerformanceResponse mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
            SrPerformanceResponse dto = new SrPerformanceResponse();
            dto.setDbCode(rs.getString("db_code"));
            dto.setDbName(rs.getString("distributor_name"));
            dto.setUserName(rs.getString("user_name"));
            dto.setUserId(rs.getString("user_id"));
            dto.setTotalInvoicedAmount(rs.getBigDecimal("total_invoiced_amount"));
            return dto;
        }
    }
    
    private static class DistributorReportMapper implements RowMapper<DistributorReportResponse> {
        @Override
        public DistributorReportResponse mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
            DistributorReportResponse dto = new DistributorReportResponse();
            dto.setName(rs.getString("name"));
            dto.setTotalSalesAmount(rs.getBigDecimal("total_sales_amount"));
            dto.setTotalCollectionAmount(rs.getBigDecimal("total_collection_amount"));
            dto.setDurationDue(rs.getBigDecimal("duration_due"));
            return dto;
        }
    }

    private static class DistributorMapper implements RowMapper<DistributorResponse> {
        @Override
        public DistributorResponse mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
            DistributorResponse dto = new DistributorResponse();
            dto.setCode(rs.getString("code"));
            dto.setName(rs.getString("name"));
            return dto;
        }
    }
}
