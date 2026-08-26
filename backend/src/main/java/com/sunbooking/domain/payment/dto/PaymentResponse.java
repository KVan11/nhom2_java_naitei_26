package com.sunbooking.domain.payment.dto;

import com.sunbooking.domain.payment.entity.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PaymentResponse {
    private Long id;
    private String bookingId;
    private BigDecimal amount;
    private String transactionReference;
    private PaymentStatus status;
    private String qrCodeUrl; // Generated URL for FE to display QR code
    private String createdAt;
    private String expiredAt; // Reservation expiry time
}