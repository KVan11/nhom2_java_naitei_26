package com.sunbooking.domain.review.service.admin;

import com.sunbooking.domain.review.dto.ReviewResponse;
import com.sunbooking.domain.review.entity.Review;
import com.sunbooking.domain.review.repository.CommentRepository;
import com.sunbooking.domain.review.repository.ReviewLikeRepository;
import com.sunbooking.domain.review.repository.ReviewRepository;
import com.sunbooking.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminReviewServiceImpl implements AdminReviewService {

    private final ReviewRepository reviewRepository;
    private final CommentRepository commentRepository;
    private final ReviewLikeRepository reviewLikeRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviews() {
        return reviewRepository.findAllWithDetails().stream()
                .map(ReviewResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponse getReviewById(Long reviewId) {
        Review review = reviewRepository.findByIdWithDetails(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));
        return ReviewResponse.from(review);
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findByIdWithDetails(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        // schema.sql does not define ON DELETE CASCADE for comments/review_like.
        // Delete dependent rows explicitly before deleting the review itself.
        commentRepository.clearParentReferencesByReviewId(reviewId);
        commentRepository.deleteByReviewId(reviewId);
        reviewLikeRepository.deleteByReviewId(reviewId);
        reviewRepository.delete(review);
    }
}
