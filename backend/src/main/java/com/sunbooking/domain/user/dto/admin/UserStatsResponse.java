package com.sunbooking.domain.user.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsResponse {
    private long totalUsers;
    private long activeUsers;
    private long inactiveUsers;
    private long lockedUsers;
    private long newThisWeek;
    private long adminUsers;
    private long regularUsers;
    private long staffUsers;
    private long guideUsers;
}
