package org.ecommercesample.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ProductRequest {
    private String name;
    private String brand;
    private String description;
    private BigDecimal originalPrice;
    private Integer discountPercentage;
    private Integer stockQuantity;
    private LocalDate mfgDate;
    private Boolean available;
    private Long categoryId;
}
