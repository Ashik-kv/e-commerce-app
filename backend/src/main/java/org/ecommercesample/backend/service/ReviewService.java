package org.ecommercesample.backend.service;

import org.ecommercesample.backend.dto.ReviewResponse;
import org.ecommercesample.backend.dto.ReviewUpdateRequest;
import org.ecommercesample.backend.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ReviewService {
    Page<Review> getReviews(Pageable pageable);
    Optional<Review> getReviewById(Long reviewId);
    List<ReviewResponse> getReviewsByProductId(Long productId, Long currentUserId);
    ReviewResponse updateReviewById(Long  reviewId, ReviewUpdateRequest reviewDetails, Long currentUserId);
    Review addReview(Long productId, Review review, Long currentUserId);
    void deleteReviewById(Long reviewId);
    Double getAverageRatingForProduct(Long productId);
}
