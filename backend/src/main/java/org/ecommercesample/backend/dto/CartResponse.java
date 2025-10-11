package org.ecommercesample.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CartResponse {
    private Long id;
    private List<CartItemResponse> cartItems;
    private BigDecimal totalPrice;
}
