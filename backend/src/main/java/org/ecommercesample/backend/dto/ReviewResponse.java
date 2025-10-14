package org.ecommercesample.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewResponse {
    private Long id;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
    private UserDto user;
    private boolean ownedByUser;
}
