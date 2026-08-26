package com.sunbooking.domain.user.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.sunbooking.domain.user.entity.Role;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserRoleUpdateRequest {

    @NotNull(message = "Role cannot be null")
    private Role role; // USER, ADMIN
}
