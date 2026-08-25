package com.sunbooking.domain.user.service.admin;

import com.sunbooking.domain.user.dto.UserResponse;
import com.sunbooking.domain.user.dto.admin.AdminCreateUserRequest;
import com.sunbooking.domain.user.dto.admin.AdminUpdateUserRequest;
import com.sunbooking.domain.user.dto.admin.UserStatsResponse;
import com.sunbooking.domain.user.entity.User;
import com.sunbooking.domain.user.repository.UserRepository;
import com.sunbooking.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> searchUsers(String keyword, String role, String status, Pageable pageable) {
        String cleanKeyword = StringUtils.hasText(keyword) ? keyword.trim() : null;
        String cleanRole = StringUtils.hasText(role) ? role.trim().toUpperCase() : null;
        String cleanStatus = StringUtils.hasText(status) ? status.trim().toUpperCase() : null;

        Page<User> usersPage = userRepository.searchUsers(cleanKeyword, cleanRole, cleanStatus, pageable);
        return usersPage.map(UserResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserResponse.fromEntity(user);
    }

    @Override
    @Transactional
    public UserResponse createUser(AdminCreateUserRequest request) {
        String username = request.getUsername().trim();
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username is already taken: " + username);
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered: " + email);
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPhone(StringUtils.hasText(request.getPhone()) ? request.getPhone().trim() : null);
        user.setAvatar(StringUtils.hasText(request.getAvatar()) ? request.getAvatar().trim() : null);

        String role = StringUtils.hasText(request.getRole())
                ? request.getRole().trim().toUpperCase()
                : "USER";
        user.setRole(role);

        String status = StringUtils.hasText(request.getStatus())
                ? request.getStatus().trim().toUpperCase()
                : "ACTIVE";
        user.setStatus(status);

        User savedUser = userRepository.save(user);
        return UserResponse.fromEntity(savedUser);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, AdminUpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (StringUtils.hasText(request.getEmail())) {
            String cleanEmail = request.getEmail().trim().toLowerCase();
            if (userRepository.existsByEmailAndIdNot(cleanEmail, id)) {
                throw new IllegalArgumentException("Email is already in use by another user: " + cleanEmail);
            }
            user.setEmail(cleanEmail);
        }

        if (StringUtils.hasText(request.getFullName())) {
            user.setFullName(request.getFullName().trim());
        }

        if (request.getPhone() != null) {
            user.setPhone(StringUtils.hasText(request.getPhone()) ? request.getPhone().trim() : null);
        }

        if (request.getAvatar() != null) {
            user.setAvatar(StringUtils.hasText(request.getAvatar()) ? request.getAvatar().trim() : null);
        }

        if (StringUtils.hasText(request.getRole())) {
            user.setRole(request.getRole().trim().toUpperCase());
        }

        if (StringUtils.hasText(request.getStatus())) {
            user.setStatus(request.getStatus().trim().toUpperCase());
        }

        if (StringUtils.hasText(request.getPassword())) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updatedUser = userRepository.save(user);
        return UserResponse.fromEntity(updatedUser);
    }

    @Override
    @Transactional
    public UserResponse updateStatus(Long id, String status) {
        if (!StringUtils.hasText(status)) {
            throw new IllegalArgumentException("Status cannot be empty");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        String cleanStatus = status.trim().toUpperCase();
        user.setStatus(cleanStatus);

        User updatedUser = userRepository.save(user);
        return UserResponse.fromEntity(updatedUser);
    }

    @Override
    @Transactional
    public UserResponse updateRole(Long id, String role) {
        if (!StringUtils.hasText(role)) {
            throw new IllegalArgumentException("Role cannot be empty");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        String cleanRole = role.trim().toUpperCase();
        user.setRole(cleanRole);

        User updatedUser = userRepository.save(user);
        return UserResponse.fromEntity(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long id, Long currentAdminId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (currentAdminId != null && currentAdminId.equals(id)) {
            throw new IllegalArgumentException("You cannot delete your own admin account");
        }

        // Soft delete: Change status to DELETED
        user.setStatus("DELETED");
        userRepository.save(user);
    }

    @Override
    @Transactional
    public UserResponse restoreUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Restore: Set status back to ACTIVE
        user.setStatus("ACTIVE");
        User restoredUser = userRepository.save(user);
        return UserResponse.fromEntity(restoredUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserStatsResponse getUserStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByStatusIgnoreCase("ACTIVE");
        long inactiveUsers = userRepository.countByStatusIgnoreCase("INACTIVE");
        long lockedUsers = userRepository.countByStatusIgnoreCase("LOCKED");
        long deletedUsers = userRepository.countByStatusIgnoreCase("DELETED");
        long newThisWeek = userRepository.countByCreatedAtAfter(LocalDateTime.now().minusDays(7));
        long adminUsers = userRepository.countByRoleIgnoreCase("ADMIN");
        long regularUsers = userRepository.countByRoleIgnoreCase("USER");
        long staffUsers = userRepository.countByRoleIgnoreCase("STAFF");
        long guideUsers = userRepository.countByRoleIgnoreCase("GUIDE");

        return UserStatsResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .inactiveUsers(inactiveUsers)
                .lockedUsers(lockedUsers)
                .deletedUsers(deletedUsers)
                .newThisWeek(newThisWeek)
                .adminUsers(adminUsers)
                .regularUsers(regularUsers)
                .staffUsers(staffUsers)
                .guideUsers(guideUsers)
                .build();
    }
}
