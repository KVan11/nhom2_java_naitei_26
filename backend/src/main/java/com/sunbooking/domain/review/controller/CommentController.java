package com.sunbooking.domain.review.controller;

import com.sunbooking.domain.review.dto.CommentResponse;
import com.sunbooking.domain.review.dto.CreateCommentRequest;
import com.sunbooking.domain.review.service.CommentService;
import com.sunbooking.global.security.CustomUserDetails;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reviews/{reviewId}/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long reviewId) {
        return ResponseEntity.ok(commentService.getComments(reviewId));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateCommentRequest request) {
        CommentResponse response = commentService.createComment(
                reviewId,
                userDetails.getUser().getId(),
                request
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
