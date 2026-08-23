package com.sunbooking.domain.payment.dto.admin;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface DailyRevenueResponse {
    LocalDate getDate();
    BigDecimal getAmount();
}