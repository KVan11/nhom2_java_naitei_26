package com.sunbooking.domain.payment.controller;

import com.sunbooking.domain.booking.entity.Booking;
import com.sunbooking.domain.booking.repository.BookingRepository;
import com.sunbooking.domain.payment.dto.PaymentResponse;
import com.sunbooking.domain.payment.entity.Payment;
import com.sunbooking.domain.payment.repository.PaymentRepository;
import com.sunbooking.domain.payment.service.PaymentService;
import com.sunbooking.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    // API to initiate payment and generate QR
    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(@RequestBody Map<String, Long> request) {
        Long bookingId = request.get("bookingId");

        // Find booking by ID (using group's repository)
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        // Generate payment record and SePay QR URL
        PaymentResponse response = paymentService.createPayment(booking);
        return ResponseEntity.ok(response);
    }

    // API for Frontend polling to check payment result
    @GetMapping("/{id}/status")
    public ResponseEntity<?> getPaymentStatus(@PathVariable Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment session not found"));

        // Return current status (PENDING, SUCCESS, EXPIRED, etc.)
        return ResponseEntity.ok(Map.of("status", payment.getStatus()));
    }
}