package com.sunbooking.domain.user.service;

import com.sunbooking.domain.user.dto.ChangePasswordRequest;
import com.sunbooking.domain.user.dto.UserProfileUpdateRequest;
import com.sunbooking.domain.user.dto.UserResponse;

public interface UserService {

    UserResponse updateProfile(Long userId, UserProfileUpdateRequest request);

    void changePassword(Long userId, ChangePasswordRequest request);
}
