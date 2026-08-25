package com.sunbooking.domain.review.service.admin;

import com.sunbooking.domain.review.dto.ReviewResponse;

import java.util.List;

public interface AdminReviewService {

    List<ReviewResponse> getReviews();

    ReviewResponse getReviewById(Long reviewId);

    void deleteReview(Long reviewId);
}
