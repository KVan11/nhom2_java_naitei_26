package com.sunbooking.domain.booking.controller;

import com.sunbooking.domain.booking.dto.BookingRequest;
import com.sunbooking.domain.booking.dto.BookingResponse;
import com.sunbooking.domain.booking.service.BookingService;
import com.sunbooking.global.security.CustomUserDetails;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@org.springframework.security.access.prepost.PreAuthorize("hasRole('USER')")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody BookingRequest request) {

        Long userId = userDetails.getUser().getId();

        BookingResponse response = bookingService.createBooking(userId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {

        Long userId = userDetails.getUser().getId();

        BookingResponse response = bookingService.cancelBooking(userId, id);
        return ResponseEntity.ok(response);
    }
}
