package com.sunbooking.domain.payment.service;

import com.sunbooking.domain.booking.repository.BookingRepository;
import com.sunbooking.domain.payment.dto.SePayWebhookRequest;
import com.sunbooking.domain.payment.entity.Payment;
import com.sunbooking.domain.payment.entity.PaymentStatus;
import com.sunbooking.domain.payment.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.mockito.Mockito.*;

class PaymentConfirmationServiceTest {

    @Mock private PaymentRepository paymentRepository;
    @Mock private BookingRepository bookingRepository;
    @InjectMocks private PaymentConfirmationService confirmationService;

    @BeforeEach
    void setUp() { MockitoAnnotations.openMocks(this); }

    @Test
    void confirmPayment_ShouldDoNothing_WhenPaymentAlreadyProcessed() {
        // Mock an already SUCCESS payment
        SePayWebhookRequest request = new SePayWebhookRequest();
        request.setContent("SUNBK123");

        Payment existingPayment = new Payment();
        existingPayment.setStatus(PaymentStatus.SUCCESS);

        when(paymentRepository.findByTransactionReference("SUNBK123"))
                .thenReturn(Optional.of(existingPayment));

        confirmationService.confirmPayment(request);

        // Verify that save was never called again (Idempotency)
        verify(paymentRepository, never()).save(any());
    }

    @Test
    void confirmPayment_ShouldNotUpdate_WhenPaymentIsExpired() {
        // Mock an EXPIRED payment
        SePayWebhookRequest request = new SePayWebhookRequest();
        request.setContent("SUNBK456");

        Payment expiredPayment = new Payment();
        expiredPayment.setStatus(PaymentStatus.EXPIRED);

        when(paymentRepository.findByTransactionReference("SUNBK456"))
                .thenReturn(Optional.of(expiredPayment));

        confirmationService.confirmPayment(request);

        // Verify status remains EXPIRED and not changed to SUCCESS
        verify(bookingRepository, never()).save(any());
    }
}