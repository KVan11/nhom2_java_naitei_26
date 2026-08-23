package com.sunbooking.domain.review.service;

import com.sunbooking.domain.review.dto.CommentResponse;
import com.sunbooking.domain.review.dto.CreateCommentRequest;

import java.util.List;

public interface CommentService {

    List<CommentResponse> getComments(Long reviewId);

    CommentResponse createComment(Long reviewId, Long userId, CreateCommentRequest request);
}
