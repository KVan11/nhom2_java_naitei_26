package com.sunbooking.domain.user.dto.admin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.sunbooking.domain.user.entity.Role;
import com.sunbooking.domain.user.entity.UserStatus;

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

    private Role role; // USER, ADMIN

    private UserStatus status; // ACTIVE, INACTIVE, LOCKED

    @Size(min = 8, max = 100, message = "Password must be at least 8 characters if provided")
    private String password; // Optional: set new password if not null/blank
}
