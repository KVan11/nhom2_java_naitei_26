package com.sunbooking.domain.booking.service.admin;

import com.sunbooking.domain.booking.dto.admin.AdminBookingFilter;
import com.sunbooking.domain.booking.dto.admin.AdminBookingResponse;
import com.sunbooking.domain.booking.dto.admin.AdminBookingStatsResponse;
import com.sunbooking.domain.booking.entity.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminBookingService {
    Page<AdminBookingResponse> searchBookings(Pageable pageable, AdminBookingFilter filter);
    AdminBookingResponse getBookingDetails(Long id);
    AdminBookingResponse updateBookingStatus(Long id, BookingStatus status);
    AdminBookingStatsResponse getBookingStats();
}
