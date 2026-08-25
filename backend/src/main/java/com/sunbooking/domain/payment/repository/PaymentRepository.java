package com.sunbooking.domain.payment.repository;

import com.sunbooking.domain.payment.dto.admin.DailyRevenueResponse;
import com.sunbooking.domain.payment.entity.Payment;
import com.sunbooking.domain.payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Find payment by reference for Webhook processing
    Optional<Payment> findByTransactionReference(String transactionReference);

    // Find pending payments for cleanup job
    List<Payment> findByStatusAndCreatedAtBefore(PaymentStatus status, LocalDateTime dateTime);

    // Find the latest payment for a booking
    Optional<Payment> findTopByBooking_IdOrderByCreatedAtDesc(Long bookingId);

    // Total success revenue
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'SUCCESS'")
    BigDecimal sumTotalRevenue();

    // Daily revenue for chart (last 30 days)
    @Query("SELECT CAST(p.paidAt AS date) as date, SUM(p.amount) as amount " +
            "FROM Payment p WHERE p.status = 'SUCCESS' AND p.paidAt >= :startDate " +
            "GROUP BY CAST(p.paidAt AS date) " +
            "ORDER BY CAST(p.paidAt AS date) ASC")
    List<DailyRevenueResponse> getDailyRevenue(LocalDateTime startDate);
}