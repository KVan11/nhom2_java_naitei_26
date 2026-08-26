package com.sunbooking.domain.payment.service;

import com.sunbooking.config.SePayConfig;
import com.sunbooking.domain.booking.entity.Booking;
import com.sunbooking.domain.payment.dto.PaymentResponse;
import com.sunbooking.domain.payment.entity.Payment;
import com.sunbooking.domain.payment.entity.PaymentStatus;
import com.sunbooking.domain.payment.repository.PaymentRepository;
import com.sunbooking.domain.tour.service.CapacityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final SePayConfig sePayConfig;
    private final CapacityService capacityService;

    @Transactional
    public PaymentResponse createPayment(Booking booking) {
        // Reserve slots first to prevent overbooking
        capacityService.reserveCapacity(
                booking.getDeparture().getId(),
                booking.getNumberOfPeople()
        );

        // Generate unique reference for SePay
        String reference = sePayConfig.getQrPrefix() + booking.getId() +
                UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        Payment payment = Payment.builder()
                .booking(booking)
                .amount(booking.getTotalPrice())
                .transactionReference(reference)
                .paymentMethod("VIETQR")
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        // SePay VietQR URL format
        String qrUrl = String.format("https://qr.sepay.vn/img?acc=%s&bank=%s&amount=%s&des=%s",
                sePayConfig.getBankAccount(), sePayConfig.getBankName(),
                savedPayment.getAmount().toPlainString(), reference);

        return mapToResponse(savedPayment, qrUrl);
    }

    @Transactional
    public void processExpiredPayments() {
        // Find PENDING payments older than 15 minutes
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(15);
        List<Payment> expiredPayments = paymentRepository.findByStatusAndCreatedAtBefore(
                PaymentStatus.PENDING, threshold);

        for (Payment payment : expiredPayments) {
            // Update status to EXPIRED
            payment.setStatus(PaymentStatus.EXPIRED);
            paymentRepository.save(payment);

            // Return slots to Tour Departure
            capacityService.releaseCapacity(
                    payment.getBooking().getDeparture().getId(),
                    payment.getBooking().getNumberOfPeople()
            );
        }
    }

    private PaymentResponse mapToResponse(Payment payment, String qrUrl) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(payment.getBooking().getId().toString())
                .amount(payment.getAmount())
                .transactionReference(payment.getTransactionReference())
                .status(payment.getStatus())
                .qrCodeUrl(qrUrl)
                .createdAt(payment.getCreatedAt() != null ? payment.getCreatedAt().toString() : null)
                .expiredAt(payment.getExpiredAt() != null ? payment.getExpiredAt().toString() : null)
                .build();
    }
}
