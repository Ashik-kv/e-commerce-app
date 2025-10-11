package org.ecommercesample.backend.dto;

import lombok.Data;

@Data
public class AddToCartRequest {
    private Long productId;
    private int quantity;
}
