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
        com.sunbooking.domain.user.entity.Role enumRole = null;
        if (StringUtils.hasText(role)) {
            try { enumRole = com.sunbooking.domain.user.entity.Role.valueOf(role.trim().toUpperCase()); } catch (IllegalArgumentException e) {}
        }
        com.sunbooking.domain.user.entity.UserStatus enumStatus = null;
        if (StringUtils.hasText(status)) {
            try { enumStatus = com.sunbooking.domain.user.entity.UserStatus.valueOf(status.trim().toUpperCase()); } catch (IllegalArgumentException e) {}
        }

        Page<User> usersPage = userRepository.searchUsers(cleanKeyword, enumRole, enumStatus, pageable);
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

        user.setRole(request.getRole() != null ? request.getRole() : com.sunbooking.domain.user.entity.Role.USER);
        user.setStatus(request.getStatus() != null ? request.getStatus() : com.sunbooking.domain.user.entity.UserStatus.ACTIVE);

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

        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }

        if (StringUtils.hasText(request.getPassword())) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updatedUser = userRepository.save(user);
        return UserResponse.fromEntity(updatedUser);
    }

    @Override
    @Transactional
    public UserResponse updateStatus(Long id, com.sunbooking.domain.user.entity.UserStatus status) {
        if (status == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setStatus(status);

        User updatedUser = userRepository.save(user);
        return UserResponse.fromEntity(updatedUser);
    }

    @Override
    @Transactional
    public UserResponse updateRole(Long id, com.sunbooking.domain.user.entity.Role role) {
        if (role == null) {
            throw new IllegalArgumentException("Role cannot be null");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setRole(role);

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
        // user.setStatus("DELETED"); // Note: DELETED status is not in the Enum UserStatus.
        // It should be INACTIVE or we need to add DELETED to UserStatus enum.
        // Let's add DELETED to UserStatus later or just use INACTIVE. Wait, I will use INACTIVE.
        user.setStatus(com.sunbooking.domain.user.entity.UserStatus.INACTIVE);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public UserResponse restoreUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Restore: Set status back to ACTIVE
        user.setStatus(com.sunbooking.domain.user.entity.UserStatus.ACTIVE);
        User restoredUser = userRepository.save(user);
        return UserResponse.fromEntity(restoredUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserStatsResponse getUserStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByStatus(com.sunbooking.domain.user.entity.UserStatus.ACTIVE);
        long inactiveUsers = userRepository.countByStatus(com.sunbooking.domain.user.entity.UserStatus.INACTIVE);
        long lockedUsers = userRepository.countByStatus(com.sunbooking.domain.user.entity.UserStatus.LOCKED);
        long deletedUsers = 0;
        long newThisWeek = userRepository.countByCreatedAtAfter(LocalDateTime.now().minusDays(7));
        long adminUsers = userRepository.countByRole(com.sunbooking.domain.user.entity.Role.ADMIN);
        long regularUsers = userRepository.countByRole(com.sunbooking.domain.user.entity.Role.USER);
        long staffUsers = 0;
        long guideUsers = 0;

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
