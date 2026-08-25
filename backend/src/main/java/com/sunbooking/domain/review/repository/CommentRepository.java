package com.sunbooking.domain.review.repository;

import com.sunbooking.domain.review.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c " +
            "JOIN FETCH c.user " +
            "LEFT JOIN FETCH c.parentComment " +
            "WHERE c.review.id = :reviewId " +
            "ORDER BY c.createdAt ASC, c.id ASC")
    List<Comment> findByReviewIdWithUser(@Param("reviewId") Long reviewId);

    @Modifying
    @Query("UPDATE Comment c SET c.parentComment = null WHERE c.review.id = :reviewId")
    int clearParentReferencesByReviewId(@Param("reviewId") Long reviewId);

    @Modifying
    @Query("DELETE FROM Comment c WHERE c.review.id = :reviewId")
    int deleteByReviewId(@Param("reviewId") Long reviewId);
}
