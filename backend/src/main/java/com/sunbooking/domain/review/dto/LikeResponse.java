package com.sunbooking.domain.review.dto;

public record LikeResponse(
        Long reviewId,
        boolean liked,
        long likeCount
) {
}
