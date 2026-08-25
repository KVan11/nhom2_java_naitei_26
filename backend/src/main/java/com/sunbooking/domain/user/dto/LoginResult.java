package com.sunbooking.domain.user.dto;

public record LoginResult(
        String token,
        UserResponse userResponse
) {
}
