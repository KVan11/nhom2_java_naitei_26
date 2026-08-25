package com.sunbooking.domain.booking.dto;

import com.sunbooking.domain.booking.entity.Gender;
import com.sunbooking.domain.booking.entity.TravelerType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingTravelerDto {
    
    @NotBlank(message = "Traveler full name is required")
    private String fullName;

    private Gender gender;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @jakarta.validation.constraints.Pattern(regexp = "^(0|\\+84)[0-9]{9}$", message = "Phone number must be a valid VN phone number")
    private String phone;

    @NotNull(message = "Traveler type is required (e.g. ADULT, CHILD)")
    private TravelerType travelerType;
}
