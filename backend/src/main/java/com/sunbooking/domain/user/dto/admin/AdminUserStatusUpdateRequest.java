package com.sunbooking.domain.user.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserStatusUpdateRequest {

    @NotBlank(message = "Status cannot be blank")
    private String status; // ACTIVE, INACTIVE, LOCKED
}
