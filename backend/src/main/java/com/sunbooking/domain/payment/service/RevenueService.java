package com.sunbooking.domain.payment.service;

import com.sunbooking.domain.payment.dto.admin.DailyRevenueResponse;
import com.sunbooking.domain.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RevenueService {

    private final PaymentRepository paymentRepository;

    public Map<String, Object> getAdminDashboardStats() {
        BigDecimal total = paymentRepository.sumTotalRevenue();

        // Chart data for last 14 days
        List<DailyRevenueResponse> chartData = paymentRepository.getDailyRevenue(
                LocalDateTime.now().minusDays(14)
        );

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", total != null ? total : BigDecimal.ZERO);
        stats.put("chartData", chartData);
        return stats;
    }
}