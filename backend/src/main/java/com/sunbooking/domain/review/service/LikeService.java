package com.sunbooking.domain.review.service;

import com.sunbooking.domain.review.dto.LikeResponse;

public interface LikeService {

    LikeResponse getLikeStatus(Long reviewId, Long userId);

    LikeResponse toggleLike(Long reviewId, Long userId);
}
