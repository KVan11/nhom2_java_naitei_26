package com.sunbooking.domain.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public class RegisterRequest {

    @NotBlank(message = "Username cannot be empty")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(regexp="^[a-zA-Z0-9._-]{3,50}$", message="Username only accepts letters, numbers, dot, underscore, and hyphen")
    private String username;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 8, max = 64, message = "Password must be between 8 and 64 characters")
    private String password;

    @NotBlank(message = "Full name cannot be empty")
    @Size(min = 3, max = 50, message = "Full name must be between 3 and 50 characters")
    private String fullName;

    @NotBlank(message = "Email cannot be empty")
    @Email(regexp="^[\\w.+-]+@[\\w-]+\\.[\\w.-]{2,}$", message = "Email must be a valid email address")
    @Size(max = 254, message = "Email must not exceed 254 characters")
    private String email;

    @Pattern(regexp="^(0|\\+84)[0-9]{9}$", message="Phone must be a valid phone number")
    private String phone;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username != null ? username.trim().toLowerCase() : null;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName != null ? fullName.trim() : null;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email != null ? email.trim().toLowerCase() : null;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
