package com.sunbooking.domain.review.service;

import com.sunbooking.domain.review.dto.CreateReviewRequest;
import com.sunbooking.domain.review.dto.ReviewResponse;
import com.sunbooking.domain.review.dto.UpdateReviewRequest;

import java.util.List;

public interface ReviewService {

    ReviewResponse createReview(Long userId, CreateReviewRequest request);

    List<ReviewResponse> getReviews(Long tourId);

    List<ReviewResponse> getReviewsByUser(Long userId);

    ReviewResponse updateOwnReview(Long userId, Long reviewId, UpdateReviewRequest request);

    void deleteOwnReview(Long userId, Long reviewId);
}
