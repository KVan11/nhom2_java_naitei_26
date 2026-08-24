package com.sunbooking.domain.booking.service.admin;

import com.sunbooking.domain.booking.dto.BookingTravelerDto;
import com.sunbooking.domain.booking.dto.admin.AdminBookingFilter;
import com.sunbooking.domain.booking.dto.admin.AdminBookingResponse;
import com.sunbooking.domain.booking.dto.admin.AdminBookingStatsResponse;
import com.sunbooking.domain.booking.entity.Booking;
import com.sunbooking.domain.booking.entity.BookingStatus;
import com.sunbooking.domain.booking.repository.BookingRepository;
import com.sunbooking.domain.booking.repository.BookingSpecification;
import com.sunbooking.domain.payment.dto.PaymentSummaryDto;
import com.sunbooking.domain.payment.entity.Payment;
import com.sunbooking.domain.payment.repository.PaymentRepository;
import com.sunbooking.domain.tour.entity.TourDeparture;
import com.sunbooking.domain.tour.repository.TourDepartureRepository;
import com.sunbooking.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminBookingServiceImpl implements AdminBookingService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final TourDepartureRepository tourDepartureRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<AdminBookingResponse> searchBookings(Pageable pageable, AdminBookingFilter filter) {
        Page<Booking> bookings = bookingRepository.findAll(BookingSpecification.filterBookings(filter), pageable);
        return bookings.map(booking -> mapToAdminResponse(booking, false)); // No travelers for list view to save data
    }

    @Override
    @Transactional(readOnly = true)
    public AdminBookingResponse getBookingDetails(Long id) {
        Booking booking = bookingRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return mapToAdminResponse(booking, true);
    }

    @Override
    @Transactional
    public AdminBookingResponse updateBookingStatus(Long id, BookingStatus newStatus) {
        Booking booking = bookingRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        BookingStatus currentStatus = booking.getStatus();

        // Validate transition
        validateStatusTransition(currentStatus, newStatus);

        // Capacity release logic
        if ((currentStatus == BookingStatus.PENDING_PAYMENT || currentStatus == BookingStatus.CONFIRMED) 
            && (newStatus == BookingStatus.CANCELLED || newStatus == BookingStatus.EXPIRED)) {
            
            TourDeparture departure = booking.getDeparture();
            departure.setAvailableSlot(departure.getAvailableSlot() + booking.getNumberOfPeople());
            tourDepartureRepository.save(departure);
        }

        booking.setStatus(newStatus);
        Booking savedBooking = bookingRepository.save(booking);

        return mapToAdminResponse(savedBooking, true);
    }

    private void validateStatusTransition(BookingStatus current, BookingStatus next) {
        if (current == BookingStatus.CANCELLED || current == BookingStatus.EXPIRED) {
            throw new IllegalArgumentException("Cannot change status of a CANCELLED or EXPIRED booking");
        }

        if (current == BookingStatus.PENDING_PAYMENT) {
            if (next == BookingStatus.CONFIRMED) {
                throw new IllegalArgumentException("Admin cannot manually confirm a PENDING_PAYMENT booking. Confirmation must come from successful payment.");
            }
            if (next != BookingStatus.CANCELLED && next != BookingStatus.EXPIRED) {
                throw new IllegalArgumentException("Invalid status transition from PENDING_PAYMENT to " + next);
            }
        } else if (current == BookingStatus.CONFIRMED) {
            if (next != BookingStatus.CANCELLED) {
                throw new IllegalArgumentException("Invalid status transition from CONFIRMED to " + next);
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public AdminBookingStatsResponse getBookingStats() {
        List<Object[]> results = bookingRepository.countBookingsByStatus();
        
        long total = 0;
        long confirmed = 0;
        long pending = 0;
        long failed = 0;
        
        for (Object[] row : results) {
            BookingStatus status = (BookingStatus) row[0];
            long count = ((Number) row[1]).longValue();
            
            total += count;
            
            switch (status) {
                case CONFIRMED:
                    confirmed += count;
                    break;
                case PENDING_PAYMENT:
                    pending += count;
                    break;
                case CANCELLED:
                case EXPIRED:
                    failed += count;
                    break;
            }
        }
        
        return AdminBookingStatsResponse.builder()
                .total(total)
                .confirmed(confirmed)
                .pending(pending)
                .failed(failed)
                .build();
    }

    private AdminBookingResponse mapToAdminResponse(Booking booking, boolean isDetail) {
        List<BookingTravelerDto> travelers = null;
        PaymentSummaryDto paymentSummary = null;

        // Only fetch expensive relations (Travelers, Payments) when viewing details (isDetail = true)
        // This prevents the N+1 Query problem on the list page which drastically slows down load times.
        if (isDetail) {
            if (booking.getTravelers() != null) {
                travelers = booking.getTravelers().stream()
                        .map(t -> BookingTravelerDto.builder()
                                .fullName(t.getFullName())
                                .gender(t.getGender())
                                .dateOfBirth(t.getDateOfBirth())
                                .phone(t.getPhone())
                                .travelerType(t.getTravelerType())
                                .build())
                        .collect(Collectors.toList());
            }

            Payment payment = paymentRepository.findTopByBooking_IdOrderByCreatedAtDesc(booking.getId()).orElse(null);
            if (payment != null) {
                paymentSummary = PaymentSummaryDto.builder()
                        .status(payment.getStatus())
                        .amount(payment.getAmount())
                        .transactionReference(payment.getTransactionReference())
                        .paidAt(payment.getPaidAt())
                        .build();
            }
        }

        return AdminBookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getUsername())
                .userEmail(booking.getUser().getEmail())
                .departureId(booking.getDeparture().getId())
                .tourId(booking.getDeparture().getTour().getId())
                .tourName(booking.getDeparture().getTour().getName())
                .departureDate(booking.getDeparture().getDepartureDate())
                .bookingDate(booking.getBookingDate())
                .numberOfPeople(booking.getNumberOfPeople())
                .totalPrice(booking.getTotalPrice())
                .contactName(booking.getContactName())
                .contactPhone(booking.getContactPhone())
                .contactEmail(booking.getContactEmail())
                .status(booking.getStatus())
                .travelers(travelers)
                .payment(paymentSummary)
                .build();
    }
}
