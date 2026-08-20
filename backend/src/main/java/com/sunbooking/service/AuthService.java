package com.sunbooking.service;

import com.sunbooking.dto.auth.LoginRequest;
import com.sunbooking.dto.auth.RegisterRequest;
import com.sunbooking.dto.auth.UserResponse;
import com.sunbooking.entity.User;
import com.sunbooking.repository.UserRepository;
import com.sunbooking.security.CustomUserDetails;
import com.sunbooking.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    public UserResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (registerRequest.getEmail() != null && userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFullName(registerRequest.getFullName());
        user.setEmail(registerRequest.getEmail());
        user.setPhone(registerRequest.getPhone());
        user.setRole("USER");
        user.setStatus("ACTIVE");

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getPhone(),
                savedUser.getAvatar(),
                savedUser.getRole(),
                savedUser.getStatus()
        );
    }

    public String login(LoginRequest loginRequest, AuthenticationResponseBuilder responseBuilder) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        responseBuilder.setUserResponse(new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getAvatar(),
                user.getRole(),
                user.getStatus()
        ));

        return jwtUtils.generateTokenFromUsername(user.getUsername());
    }

    public static class AuthenticationResponseBuilder {
        private UserResponse userResponse;

        public UserResponse getUserResponse() {
            return userResponse;
        }

        public void setUserResponse(UserResponse userResponse) {
            this.userResponse = userResponse;
        }
    }
}
