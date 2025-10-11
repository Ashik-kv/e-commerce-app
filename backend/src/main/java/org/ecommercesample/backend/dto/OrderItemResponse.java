package org.ecommercesample.backend.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private int quantity;
    private BigDecimal price;
    private BigDecimal subtotal;
}
