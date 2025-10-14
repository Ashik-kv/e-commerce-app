package org.ecommercesample.backend.controller;

import jakarta.validation.Valid;
import org.ecommercesample.backend.dto.ReviewResponse;
import org.ecommercesample.backend.dto.ReviewUpdateRequest;
import org.ecommercesample.backend.model.Review;
import org.ecommercesample.backend.model.UserPrincipal;
import org.ecommercesample.backend.service.ReviewService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;


    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public Page<Review> getReviews(@PageableDefault(size = 10) Pageable pageable) {
        return reviewService.getReviews(pageable);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable long id) {
        return reviewService.getReviewById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());

    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByProductId(@PathVariable Long productId,
                                                                      @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long currentUserId = (userPrincipal != null) ? userPrincipal.getUser().getId() : null;
        return ResponseEntity.ok(reviewService.getReviewsByProductId(productId, currentUserId));
    }

    @GetMapping("/product/{productId}/average-rating")
    public ResponseEntity<Double> getAverageRatingForProduct(@PathVariable Long productId) {
        Double averageRating = reviewService.getAverageRatingForProduct(productId);
        return ResponseEntity.ok(averageRating);
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<Review> createReview(@PathVariable Long productId,@Valid @RequestBody Review review, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Review savedReview = reviewService.addReview(productId, review, userPrincipal.getUser().getId());
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedReview.getId())
                .toUri();
        return ResponseEntity.created(location).body(savedReview);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> updateReviewById(@PathVariable Long  reviewId, @Valid @RequestBody ReviewUpdateRequest reviewRequest, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ReviewResponse updatedReview = reviewService.updateReviewById(reviewId, reviewRequest, userPrincipal.getUser().getId());
        return ResponseEntity.ok(updatedReview);
    }

    @DeleteMapping("/{reviewId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(@PathVariable long reviewId) {
        reviewService.deleteReviewById(reviewId);
    }
}