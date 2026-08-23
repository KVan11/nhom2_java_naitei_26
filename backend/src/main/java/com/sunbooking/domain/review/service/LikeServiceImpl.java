package com.sunbooking.domain.review.service;

import com.sunbooking.domain.review.dto.LikeResponse;
import com.sunbooking.domain.review.entity.Review;
import com.sunbooking.domain.review.entity.ReviewLike;
import com.sunbooking.domain.review.repository.ReviewLikeRepository;
import com.sunbooking.domain.review.repository.ReviewRepository;
import com.sunbooking.domain.user.entity.User;
import com.sunbooking.domain.user.repository.UserRepository;
import com.sunbooking.global.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LikeServiceImpl implements LikeService {

    private final ReviewLikeRepository reviewLikeRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public LikeServiceImpl(
            ReviewLikeRepository reviewLikeRepository,
            ReviewRepository reviewRepository,
            UserRepository userRepository) {
        this.reviewLikeRepository = reviewLikeRepository;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public LikeResponse getLikeStatus(Long reviewId, Long userId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new ResourceNotFoundException("Review not found");
        }

        boolean liked = userId != null
                && !reviewLikeRepository.findAllByReview_IdAndUser_Id(reviewId, userId).isEmpty();
        long likeCount = reviewLikeRepository.countByReview_Id(reviewId);

        return new LikeResponse(reviewId, liked, likeCount);
    }

    @Override
    @Transactional
    public LikeResponse toggleLike(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<ReviewLike> existingLikes = reviewLikeRepository.findAllByReview_IdAndUser_Id(reviewId, userId);
        boolean liked;

        if (existingLikes.isEmpty()) {
            ReviewLike reviewLike = new ReviewLike();
            reviewLike.setReview(review);
            reviewLike.setUser(user);
            reviewLikeRepository.saveAndFlush(reviewLike);
            liked = true;
        } else {
            reviewLikeRepository.deleteAllInBatch(existingLikes);
            liked = false;
        }

        long likeCount = reviewLikeRepository.countByReview_Id(reviewId);
        return new LikeResponse(reviewId, liked, likeCount);
    }
}
