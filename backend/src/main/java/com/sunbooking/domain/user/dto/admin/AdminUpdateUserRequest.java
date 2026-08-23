package com.sunbooking.domain.user.dto.admin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUpdateUserRequest {

    @Size(max = 100, message = "Full name must be at most 100 characters")
    private String fullName;

    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must be at most 100 characters")
    private String email;

    @Size(max = 20, message = "Phone number must be at most 20 characters")
    private String phone;

    private String avatar;

    private String role; // USER, ADMIN, STAFF, GUIDE

    private String status; // ACTIVE, INACTIVE, LOCKED

    @Size(min = 6, max = 100, message = "Password must be at least 6 characters if provided")
    private String password; // Optional: set new password if not null/blank
}
