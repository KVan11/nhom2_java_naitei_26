package com.sunbooking.domain.review.repository;

import com.sunbooking.domain.review.entity.ReviewLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewLikeRepository extends JpaRepository<ReviewLike, Long> {

    List<ReviewLike> findAllByReview_IdAndUser_Id(Long reviewId, Long userId);

    long countByReview_Id(Long reviewId);

    @Modifying
    @Query("DELETE FROM ReviewLike rl WHERE rl.review.id = :reviewId")
    int deleteByReviewId(@Param("reviewId") Long reviewId);
}
