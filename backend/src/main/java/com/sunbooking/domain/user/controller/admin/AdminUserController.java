package com.sunbooking.domain.user.controller.admin;

import com.sunbooking.domain.user.dto.UserResponse;
import com.sunbooking.domain.user.dto.admin.AdminCreateUserRequest;
import com.sunbooking.domain.user.dto.admin.AdminUpdateUserRequest;
import com.sunbooking.domain.user.dto.admin.AdminUserRoleUpdateRequest;
import com.sunbooking.domain.user.dto.admin.AdminUserStatusUpdateRequest;
import com.sunbooking.domain.user.dto.admin.UserStatsResponse;
import com.sunbooking.domain.user.service.admin.AdminUserService;
import com.sunbooking.global.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private static final Set<String> ALLOWED_SORT_PROPERTIES = Set.of(
            "id", "username", "fullName", "email", "phone", "role", "status", "createdAt", "updatedAt");

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<Page<UserResponse>> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sort) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1), parseSort(sort));
        Page<UserResponse> result = adminUserService.searchUsers(keyword, role, status, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/stats")
    public ResponseEntity<UserStatsResponse> getStats() {
        return ResponseEntity.ok(adminUserService.getUserStats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(adminUserService.getUserById(id));
    }

    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody AdminCreateUserRequest request) {
        UserResponse response = adminUserService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody AdminUpdateUserRequest request) {
        return ResponseEntity.ok(adminUserService.updateUser(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<UserResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody AdminUserStatusUpdateRequest request) {
        return ResponseEntity.ok(adminUserService.updateStatus(id, request.getStatus()));
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<UserResponse> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody AdminUserRoleUpdateRequest request) {
        return ResponseEntity.ok(adminUserService.updateRole(id, request.getRole()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Authentication authentication) {
        Long currentAdminId = null;
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            currentAdminId = userDetails.getUser().getId();
        }
        adminUserService.deleteUser(id, currentAdminId);
    }

    private Sort parseSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "id");
        }

        String expression = normalizeSortExpression(sort);
        return expression.isBlank() ? Sort.by(Sort.Direction.DESC, "id") : Sort.by(toOrder(expression));
    }

    private String normalizeSortExpression(String expression) {
        return expression.trim()
                .replace("[", "")
                .replace("]", "")
                .replace("\"", "");
    }

    private Sort.Order toOrder(String expression) {
        String[] parts = expression.split(",", 2);
        String property = parts[0].trim();
        if (!ALLOWED_SORT_PROPERTIES.contains(property)) {
            throw new IllegalArgumentException("Invalid sort property: " + property);
        }
        Sort.Direction direction = parts.length > 1
                ? Sort.Direction.fromOptionalString(parts[1].trim()).orElse(Sort.Direction.ASC)
                : Sort.Direction.ASC;
        return new Sort.Order(direction, property);
    }
}
