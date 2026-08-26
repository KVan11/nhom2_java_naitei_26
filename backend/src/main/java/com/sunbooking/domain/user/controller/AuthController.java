package com.sunbooking.domain.user.controller;

import com.sunbooking.domain.user.dto.LoginRequest;
import com.sunbooking.domain.user.dto.LoginResult;
import com.sunbooking.domain.user.dto.RegisterRequest;
import com.sunbooking.domain.user.dto.UserResponse;
import com.sunbooking.domain.user.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        UserResponse response = authService.register(registerRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        LoginResult loginResult = authService.login(loginRequest);
        String token = loginResult.token();

        ResponseCookie cookie = ResponseCookie.from("refresh_token", loginResult.refreshToken())
                .httpOnly(true)
                .secure(true) // Secure in production
                .path("/api/auth/refresh")
                .maxAge(7 * 24 * 60 * 60) // 7 days
                .sameSite("Strict")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(loginResult.userResponse());
    }

    @PostMapping("/refresh")
    public ResponseEntity<UserResponse> refresh(@CookieValue(name = "refresh_token") String refreshToken, HttpServletResponse response) {
        LoginResult loginResult = authService.refreshToken(refreshToken);

        ResponseCookie cookie = ResponseCookie.from("refresh_token", loginResult.refreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/api/auth/refresh")
                .maxAge(7 * 24 * 60 * 60)
                .sameSite("Strict")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(loginResult.userResponse());
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@CookieValue(name = "refresh_token", required = false) String refreshToken, HttpServletResponse response) {
        authService.logout(refreshToken);
        
        ResponseCookie cookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/api/auth/refresh")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        SecurityContextHolder.clearContext();

        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("message", "Logged out successfully");

        return ResponseEntity.ok(responseBody);
    }
}
