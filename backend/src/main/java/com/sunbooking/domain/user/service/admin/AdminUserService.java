package com.sunbooking.domain.user.service.admin;

import com.sunbooking.domain.user.dto.UserResponse;
import com.sunbooking.domain.user.dto.admin.AdminCreateUserRequest;
import com.sunbooking.domain.user.dto.admin.AdminUpdateUserRequest;
import com.sunbooking.domain.user.dto.admin.UserStatsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminUserService {

    Page<UserResponse> searchUsers(String keyword, String role, String status, Pageable pageable);

    UserResponse getUserById(Long id);

    UserResponse createUser(AdminCreateUserRequest request);

    UserResponse updateUser(Long id, AdminUpdateUserRequest request);

    UserResponse updateStatus(Long id, String status);

    UserResponse updateRole(Long id, String role);

    void deleteUser(Long id, Long currentAdminId);

    UserStatsResponse getUserStats();
}
