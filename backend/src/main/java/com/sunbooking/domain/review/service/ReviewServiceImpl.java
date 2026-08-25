package com.sunbooking.domain.review.service;

import com.sunbooking.domain.booking.entity.Booking;
import com.sunbooking.domain.booking.entity.BookingStatus;
import com.sunbooking.domain.booking.repository.BookingRepository;
import com.sunbooking.domain.review.dto.CreateReviewRequest;
import com.sunbooking.domain.review.dto.ReviewResponse;
import com.sunbooking.domain.review.dto.UpdateReviewRequest;
import com.sunbooking.domain.review.entity.Review;
import com.sunbooking.domain.review.entity.ReviewImage;
import com.sunbooking.domain.review.repository.CommentRepository;
import com.sunbooking.domain.review.repository.ReviewLikeRepository;
import com.sunbooking.domain.review.repository.ReviewRepository;
import com.sunbooking.domain.tour.entity.TourDeparture;
import com.sunbooking.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final CommentRepository commentRepository;
    private final ReviewLikeRepository reviewLikeRepository;

    @Override
    @Transactional
    public ReviewResponse createReview(Long userId, CreateReviewRequest request) {
        Booking booking = bookingRepository.findByIdWithDetails(request.bookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only review your own booking");
        }

        validateBookingIsCompleted(booking);

        if (reviewRepository.existsByBooking_Id(booking.getId())) {
            throw new IllegalArgumentException("This booking already has a review");
        }

        Review review = Review.builder()
                .booking(booking)
                .content(request.content().trim())
                .rating(request.rating())
                .build();

        replaceImages(review, request.imageUrls());

        try {
            Review savedReview = reviewRepository.saveAndFlush(review);
            return ReviewResponse.from(savedReview);
        } catch (DataIntegrityViolationException ex) {
            throw new IllegalArgumentException("This booking already has a review");
        }
    }

    private void validateBookingIsCompleted(Booking booking) {
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalArgumentException("Only confirmed bookings can be reviewed");
        }

        TourDeparture departure = booking.getDeparture();
        if (departure == null
                || departure.getReturnDate() == null
                || !departure.getReturnDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("You can only review a tour after it has finished");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviews(Long tourId) {
        List<Review> reviews = tourId == null
                ? reviewRepository.findAllWithDetails()
                : reviewRepository.findByTourIdWithDetails(tourId);

        return reviews.stream()
                .map(ReviewResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByUser(Long userId) {
        return reviewRepository.findByUserIdWithDetails(userId).stream()
                .map(ReviewResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public ReviewResponse updateOwnReview(Long userId, Long reviewId, UpdateReviewRequest request) {
        Review review = findOwnedReview(userId, reviewId);
        review.setContent(request.content().trim());
        review.setRating(request.rating());
        replaceImages(review, request.imageUrls());
        return ReviewResponse.from(reviewRepository.save(review));
    }

    @Override
    @Transactional
    public void deleteOwnReview(Long userId, Long reviewId) {
        Review review = findOwnedReview(userId, reviewId);
        deleteReviewDependencies(reviewId);
        reviewRepository.delete(review);
    }

    private Review findOwnedReview(Long userId, Long reviewId) {
        Review review = reviewRepository.findByIdWithDetails(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        if (review.getBooking() == null
                || review.getBooking().getUser() == null
                || !review.getBooking().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only manage your own review");
        }

        return review;
    }

    private void replaceImages(Review review, List<String> imageUrls) {
        new ArrayList<>(review.getImages()).forEach(review::removeImage);
        if (imageUrls == null) {
            return;
        }

        imageUrls.stream()
                .map(String::trim)
                .filter(url -> !url.isEmpty())
                .forEach(imageUrl -> review.addImage(
                        ReviewImage.builder()
                                .imageUrl(imageUrl)
                                .build()));
    }

    private void deleteReviewDependencies(Long reviewId) {
        // schema.sql has no ON DELETE CASCADE for these child tables.
        commentRepository.clearParentReferencesByReviewId(reviewId);
        commentRepository.deleteByReviewId(reviewId);
        reviewLikeRepository.deleteByReviewId(reviewId);
    }
}
