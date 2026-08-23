package com.sunbooking.domain.review.service;

import com.sunbooking.domain.review.dto.CommentResponse;
import com.sunbooking.domain.review.dto.CreateCommentRequest;
import com.sunbooking.domain.review.entity.Comment;
import com.sunbooking.domain.review.entity.Review;
import com.sunbooking.domain.review.repository.CommentRepository;
import com.sunbooking.domain.review.repository.ReviewRepository;
import com.sunbooking.domain.user.entity.User;
import com.sunbooking.domain.user.repository.UserRepository;
import com.sunbooking.global.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public CommentServiceImpl(
            CommentRepository commentRepository,
            ReviewRepository reviewRepository,
            UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new ResourceNotFoundException("Review not found");
        }

        List<Comment> comments = commentRepository.findByReviewIdWithUser(reviewId);
        Map<Long, List<Comment>> repliesByParentId = new HashMap<>();

        comments.stream()
                .filter(comment -> comment.getParentComment() != null)
                .forEach(comment -> repliesByParentId
                        .computeIfAbsent(comment.getParentComment().getId(), ignored -> new ArrayList<>())
                        .add(comment));

        return comments.stream()
                .filter(comment -> comment.getParentComment() == null)
                .map(comment -> toResponseTree(comment, repliesByParentId))
                .toList();
    }

    @Override
    @Transactional
    public CommentResponse createComment(Long reviewId, Long userId, CreateCommentRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment parentComment = null;
        if (request.parentCommentId() != null) {
            parentComment = commentRepository.findById(request.parentCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));

            if (!parentComment.getReview().getId().equals(reviewId)) {
                throw new IllegalArgumentException("Parent comment does not belong to this review");
            }
        }

        Comment comment = new Comment();
        comment.setReview(review);
        comment.setUser(user);
        comment.setParentComment(parentComment);
        comment.setContent(request.content().trim());

        Comment savedComment = commentRepository.saveAndFlush(comment);
        return CommentResponse.from(savedComment, List.of());
    }

    private CommentResponse toResponseTree(Comment comment, Map<Long, List<Comment>> repliesByParentId) {
        List<CommentResponse> replies = repliesByParentId
                .getOrDefault(comment.getId(), List.of())
                .stream()
                .map(reply -> toResponseTree(reply, repliesByParentId))
                .toList();

        return CommentResponse.from(comment, replies);
    }
}
