package com.sunbooking.domain.review.controller;

import com.sunbooking.domain.review.dto.LikeResponse;
import com.sunbooking.domain.review.service.LikeService;
import com.sunbooking.global.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews/{reviewId}/like")
public class LikeController {

    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @GetMapping
    public ResponseEntity<LikeResponse> getLikeStatus(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails != null ? userDetails.getUser().getId() : null;
        return ResponseEntity.ok(likeService.getLikeStatus(reviewId, userId));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<LikeResponse> toggleLike(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(likeService.toggleLike(reviewId, userDetails.getUser().getId()));
    }
}
