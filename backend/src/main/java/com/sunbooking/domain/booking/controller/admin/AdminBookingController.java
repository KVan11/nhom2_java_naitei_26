package com.sunbooking.domain.booking.controller.admin;

import com.sunbooking.domain.booking.dto.admin.AdminBookingFilter;
import com.sunbooking.domain.booking.dto.admin.AdminBookingResponse;
import com.sunbooking.domain.booking.dto.admin.AdminBookingStatsResponse;
import com.sunbooking.domain.booking.dto.admin.AdminBookingStatusUpdateRequest;
import com.sunbooking.domain.booking.service.admin.AdminBookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminBookingController {

    private final AdminBookingService adminBookingService;

    @GetMapping
    public ResponseEntity<Page<AdminBookingResponse>> getBookings(
            Pageable pageable, 
            @ModelAttribute AdminBookingFilter filter) {
        Page<AdminBookingResponse> response = adminBookingService.searchBookings(pageable, filter);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminBookingResponse> getBookingDetails(@PathVariable Long id) {
        AdminBookingResponse response = adminBookingService.getBookingDetails(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AdminBookingResponse> updateBookingStatus(
            @PathVariable Long id,
            @Valid @RequestBody AdminBookingStatusUpdateRequest request) {
        AdminBookingResponse response = adminBookingService.updateBookingStatus(id, request.getStatus());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminBookingStatsResponse> getBookingStats() {
        AdminBookingStatsResponse response = adminBookingService.getBookingStats();
        return ResponseEntity.ok(response);
    }
}
