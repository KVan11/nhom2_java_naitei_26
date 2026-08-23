package com.sunbooking.domain.review.dto;

import com.sunbooking.domain.review.entity.Comment;
import com.sunbooking.domain.user.entity.User;

import java.time.LocalDateTime;
import java.util.List;

public record CommentResponse(
        Long id,
        Long reviewId,
        Long userId,
        String userName,
        String userAvatar,
        Long parentCommentId,
        String content,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<CommentResponse> replies
) {
    public static CommentResponse from(Comment comment, List<CommentResponse> replies) {
        User user = comment.getUser();
        Comment parentComment = comment.getParentComment();

        return new CommentResponse(
                comment.getId(),
                comment.getReview().getId(),
                user != null ? user.getId() : null,
                user != null ? user.getFullName() : null,
                user != null ? user.getAvatar() : null,
                parentComment != null ? parentComment.getId() : null,
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getUpdatedAt(),
                replies == null ? List.of() : List.copyOf(replies)
        );
    }
}
