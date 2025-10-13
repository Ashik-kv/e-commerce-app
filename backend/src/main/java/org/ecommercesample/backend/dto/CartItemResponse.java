package org.ecommercesample.backend.dto;

import lombok.Data;
import org.ecommercesample.backend.model.Product;

import java.math.BigDecimal;

@Data
public class CartItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private int quantity;
    private BigDecimal price;
    private BigDecimal subtotal;
    private Product product;
}
