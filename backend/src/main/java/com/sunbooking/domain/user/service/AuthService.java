package com.sunbooking.domain.user.service;

import com.sunbooking.domain.user.dto.LoginRequest;
import com.sunbooking.domain.user.dto.LoginResult;
import com.sunbooking.domain.user.dto.RegisterRequest;
import com.sunbooking.domain.user.dto.UserResponse;
import com.sunbooking.domain.user.entity.User;
import com.sunbooking.domain.user.repository.UserRepository;
import com.sunbooking.global.security.CustomUserDetails;
import com.sunbooking.global.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final LoginAttemptService loginAttemptService;
    private final RefreshTokenService refreshTokenService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager, JwtUtils jwtUtils,
            LoginAttemptService loginAttemptService, RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.loginAttemptService = loginAttemptService;
        this.refreshTokenService = refreshTokenService;
    }

    @Transactional
    public UserResponse register(RegisterRequest registerRequest) {
        String username = registerRequest.getUsername().toLowerCase();
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (registerRequest.getEmail() != null && userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFullName(registerRequest.getFullName());
        user.setEmail(registerRequest.getEmail());
        user.setPhone(registerRequest.getPhone());
        user.setRole(com.sunbooking.domain.user.entity.Role.USER);
        user.setStatus(com.sunbooking.domain.user.entity.UserStatus.ACTIVE);

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getPhone(),
                savedUser.getAvatar(),
                savedUser.getRole(),
                savedUser.getStatus());
    }

    public LoginResult login(LoginRequest loginRequest) {
        String username = loginRequest.getUsername().toLowerCase();

        if (loginAttemptService.isBlocked(username)) {
            throw new org.springframework.security.authentication.LockedException("Tài khoản đã bị khóa tạm thời 4 phút do nhập sai mật khẩu quá 3 lần.");
        }

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, loginRequest.getPassword()));
            loginAttemptService.loginSucceeded(username);
        } catch (org.springframework.security.core.AuthenticationException e) {
            loginAttemptService.loginFailed(username);
            throw new org.springframework.security.authentication.BadCredentialsException("Tài khoản hoặc mật khẩu không chính xác.");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof CustomUserDetails userDetails)) {
            throw new org.springframework.security.authentication.InternalAuthenticationServiceException(
                    "Expected CustomUserDetails but got " + principal.getClass().getName());
        }

        User user = userDetails.getUser();
        if (com.sunbooking.domain.user.entity.UserStatus.ACTIVE != user.getStatus()) {
            throw new org.springframework.security.authentication.DisabledException("ACCOUNT_DISABLED");
        }

        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getAvatar(),
                user.getRole(),
                user.getStatus());

        String token = jwtUtils.generateToken(userDetails);
        userResponse.setToken(token);
        
        com.sunbooking.domain.user.entity.RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());
        
        return new LoginResult(token, refreshToken.getToken(), userResponse);
    }

    @Transactional
    public LoginResult refreshToken(String refreshTokenStr) {
        return refreshTokenService.findByToken(refreshTokenStr)
                .map(refreshTokenService::verifyExpiration)
                .map(com.sunbooking.domain.user.entity.RefreshToken::getUser)
                .map(user -> {
                    String token = jwtUtils.generateToken(new CustomUserDetails(user));
                    UserResponse userResponse = new UserResponse(
                            user.getId(),
                            user.getUsername(),
                            user.getFullName(),
                            user.getEmail(),
                            user.getPhone(),
                            user.getAvatar(),
                            user.getRole(),
                            user.getStatus());
                    userResponse.setToken(token);
                    
                    // Create a new refresh token to replace the old one (Refresh Token Rotation)
                    refreshTokenService.deleteByToken(refreshTokenStr);
                    com.sunbooking.domain.user.entity.RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getId());
                    
                    return new LoginResult(token, newRefreshToken.getToken(), userResponse);
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }
    
    @Transactional
    public void logout(String refreshToken) {
        if (refreshToken != null && !refreshToken.isEmpty()) {
            refreshTokenService.deleteByToken(refreshToken);
        }
    }
}
