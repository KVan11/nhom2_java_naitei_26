package com.sunbooking.domain.payment.controller;

import com.sunbooking.domain.booking.entity.Booking;
import com.sunbooking.domain.booking.entity.BookingStatus;
import com.sunbooking.domain.booking.repository.BookingRepository;
import com.sunbooking.domain.payment.entity.Payment;
import com.sunbooking.domain.payment.entity.PaymentStatus;
import com.sunbooking.domain.payment.repository.PaymentRepository;
import com.sunbooking.domain.payment.service.PaymentWebhookService;
import com.sunbooking.domain.tour.entity.Tour;
import com.sunbooking.domain.tour.entity.TourDeparture;
import com.sunbooking.domain.tour.repository.TourDepartureRepository;
import com.sunbooking.domain.tour.repository.TourRepository;
import com.sunbooking.domain.user.entity.User;
import com.sunbooking.domain.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@Transactional
class PaymentWebhookIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private TourRepository tourRepository;
    @Autowired private TourDepartureRepository departureRepository;

    @MockitoBean private PaymentWebhookService webhookService;

    private Booking seededBooking;
    private String testRef;

    @BeforeEach
    void seedData() {
        // 1. Seed User
        User user = new User();
        user.setUsername("tester_" + System.currentTimeMillis());
        user.setEmail("test@sun.com");
        user.setPassword("password");
        user = userRepository.saveAndFlush(user);

        // 2. Seed Tour
        Tour tour = new Tour();
        tour.setName("Seed Tour");
        tour = tourRepository.saveAndFlush(tour);

        // 3. Seed Departure
        TourDeparture departure = new TourDeparture();
        departure.setTour(tour);
        departure.setPrice(new BigDecimal("1000000"));
        departure.setAvailableSlot(10);
        departure = departureRepository.saveAndFlush(departure);

        // 4. Seed Booking (The "Parent")
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setDeparture(departure);
        booking.setStatus(BookingStatus.PENDING_PAYMENT);
        booking.setTotalPrice(new BigDecimal("1000000"));
        booking.setNumberOfPeople(1);
        this.seededBooking = bookingRepository.saveAndFlush(booking);

        // 5. Seed Payment (The "Child")
        this.testRef = "REF_" + System.currentTimeMillis();
        Payment payment = Payment.builder()
                .booking(seededBooking)
                .amount(seededBooking.getTotalPrice())
                .transactionReference(testRef)
                .status(PaymentStatus.PENDING)
                .build();
        paymentRepository.saveAndFlush(payment);
    }

    @Test
    void testWebhookSuccess() throws Exception {
        // Mock security
        when(webhookService.verifySignature(anyString(), anyString())).thenReturn(true);

        // Webhook Payload
        String json = """
            {
                "content": "%s",
                "transferAmount": 1000000,
                "code": "OK123"
            }
            """.formatted(this.testRef);

        // Action
        mockMvc.perform(post("/api/payments/webhook")
                        .header("x-sepay-signature", "sign")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk());

        // Verify
        Payment updated = paymentRepository.findByTransactionReference(testRef).get();
        assertEquals(PaymentStatus.SUCCESS, updated.getStatus());
    }
}