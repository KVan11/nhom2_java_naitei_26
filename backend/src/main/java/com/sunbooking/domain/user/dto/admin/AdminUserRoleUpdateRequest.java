package com.sunbooking.domain.user.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserRoleUpdateRequest {

    @NotBlank(message = "Role cannot be blank")
    private String role; // USER, ADMIN, STAFF, GUIDE
}
