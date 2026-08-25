package com.sunbooking.domain.booking.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    
    @NotNull(message = "Departure ID is required")
    private Long departureId;

    @NotBlank(message = "Contact name is required")
    private String contactName;

    @NotBlank(message = "Contact phone is required")
    @jakarta.validation.constraints.Pattern(regexp = "^(0|\\+84)[0-9]{9}$", message = "Phone number must be a valid VN phone number")
    private String contactPhone;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Invalid email format")
    private String contactEmail;

    @NotEmpty(message = "Travelers list cannot be empty")
    @jakarta.validation.constraints.Size(max = 10, message = "Maximum 10 travelers allowed per booking")
    @Valid
    private List<BookingTravelerDto> travelers;
}
