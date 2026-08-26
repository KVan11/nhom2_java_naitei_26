package com.sunbooking.domain.user.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.sunbooking.domain.user.entity.UserStatus;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserStatusUpdateRequest {

    @NotNull(message = "Status cannot be null")
    private UserStatus status;
}
