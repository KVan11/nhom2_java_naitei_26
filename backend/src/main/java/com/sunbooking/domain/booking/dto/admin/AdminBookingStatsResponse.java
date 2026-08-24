package com.sunbooking.domain.booking.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminBookingStatsResponse {
    private long total;
    private long confirmed;
    private long pending;
    private long failed;
}
