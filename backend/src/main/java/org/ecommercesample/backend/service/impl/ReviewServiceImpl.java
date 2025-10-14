package org.ecommercesample.backend.service.impl;


import org.ecommercesample.backend.dto.ReviewResponse;
import org.ecommercesample.backend.dto.ReviewUpdateRequest;
import org.ecommercesample.backend.dto.UserDto;
import org.ecommercesample.backend.exceptions.BadRequestException;
import org.ecommercesample.backend.exceptions.ForbiddenException;
import org.ecommercesample.backend.exceptions.ResourceNotFoundException;

import org.ecommercesample.backend.model.Product;
import org.ecommercesample.backend.model.Review;
import org.ecommercesample.backend.model.User;
import org.ecommercesample.backend.repo.ProductRepo;
import org.ecommercesample.backend.repo.ReviewRepo;
import org.ecommercesample.backend.repo.UserRepo;
import org.ecommercesample.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {
    @Autowired
    private ReviewRepo reviewRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private UserRepo userRepo;

    @Override
    public Page<Review> getReviews(Pageable pageable) {
        return reviewRepo.findAll(pageable);
    }

    @Override
    public Optional<Review> getReviewById(Long reviewId) {
        return reviewRepo.findById(reviewId);
    }

    @Override
    public List<ReviewResponse> getReviewsByProductId(Long productId, Long currentUserId) {
        List<Review> reviews = reviewRepo.findByProductId(productId);
        return reviews.stream()
                .map(review -> mapReviewToResponse(review, currentUserId))
                .collect(Collectors.toList());
    }

    @Override
    public ReviewResponse updateReviewById(Long reviewId, ReviewUpdateRequest reviewDetails, Long currentUserId) {
        Review existingReview = reviewRepo.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        if (!existingReview.getUser().getId().equals(currentUserId)) {
            throw new ForbiddenException("You are not authorized to update this review.");
        }

        existingReview.setRating(reviewDetails.getRating());
        existingReview.setComment(reviewDetails.getComment());
        Review updatedReview = reviewRepo.save(existingReview);
        return mapReviewToResponse(updatedReview, currentUserId);
    }

    @Override
    public Review addReview(Long productId, Review review, Long currentUserId) {
        if (reviewRepo.findByUserIdAndProductId(currentUserId, productId).isPresent()) {
            throw new BadRequestException("You have already submitted a review for this product.");
        }

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        User user = userRepo.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + currentUserId));

        review.setProduct(product);
        review.setUser(user);
        return reviewRepo.save(review);
    }

    @Override
    public void deleteReviewById(Long reviewId) {
        reviewRepo.deleteById(reviewId);
    }

    @Override
    public Double getAverageRatingForProduct(Long productId) {
        Double avg = reviewRepo.findAverageRatingByProductId(productId);
        return avg == null ? 0.0 : avg;
    }

    private ReviewResponse mapReviewToResponse(Review review, Long currentUserId) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setCreatedAt(review.getCreatedAt());

        UserDto userDto = new UserDto();
        userDto.setFirstName(review.getUser().getFirstName());
        response.setUser(userDto);
        response.setOwnedByUser(currentUserId != null && review.getUser().getId().equals(currentUserId));
        return response;
    }
}
