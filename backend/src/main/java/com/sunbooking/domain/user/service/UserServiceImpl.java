package com.sunbooking.domain.user.service;

import com.sunbooking.domain.user.dto.ChangePasswordRequest;
import com.sunbooking.domain.user.dto.UserProfileUpdateRequest;
import com.sunbooking.domain.user.dto.UserResponse;
import com.sunbooking.domain.user.entity.User;
import com.sunbooking.domain.user.repository.SocialAccountRepository;
import com.sunbooking.domain.user.repository.UserRepository;
import com.sunbooking.domain.user.entity.SocialAccount;
import com.sunbooking.global.exception.ResourceNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SocialAccountRepository socialAccountRepository;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        UserResponse response = UserResponse.fromEntity(user);
        List<SocialAccount> socialAccounts = socialAccountRepository.findByUserId(userId);
        if (!socialAccounts.isEmpty()) {
            response.setProvider(socialAccounts.get(0).getProvider());
        }
        return response;
    }

    @Override
    @Transactional
    public UserResponse updateProfile(Long userId, UserProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setFullName(request.getFullName().trim());
        user.setPhone(request.getPhone().trim());

        User updatedUser = userRepository.save(user);
        UserResponse response = UserResponse.fromEntity(updatedUser);
        List<SocialAccount> socialAccounts = socialAccountRepository.findByUserId(userId);
        if (!socialAccounts.isEmpty()) {
            response.setProvider(socialAccounts.get(0).getProvider());
        }
        return response;
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        List<SocialAccount> socialAccounts = socialAccountRepository.findByUserId(userId);
        if (!socialAccounts.isEmpty()) {
            throw new IllegalArgumentException("Cannot change password for social login accounts");
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password does not match");
        }

        if (request.getCurrentPassword().equals(request.getNewPassword())) {
            throw new IllegalArgumentException("New password cannot be the same as the current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
