package org.ecommercesample.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="products")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    @NotBlank
    private String name;
    private String brand;
    @Column(length=1000)
    private String description;
    @Column(nullable=false, precision = 10, scale = 2)
    private BigDecimal originalPrice;
    private Integer discountPercentage;
    @Column(nullable = false)
    @Min(0)
    private Integer stockQuantity;
    private LocalDate mfgDate;
    @Column(nullable = false)
    private Boolean available;
    @CreationTimestamp
    @Column(nullable=false,updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="category_id",nullable = false)
    private Category category;
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="seller_id",nullable = false)
    private User seller;
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images=new ArrayList<>();
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews=new ArrayList<>();

    @Transient
    public BigDecimal getDiscountedPrice() {
        if(discountPercentage == null || discountPercentage <= 0 || discountPercentage > 100) {
            return originalPrice;
        }
        BigDecimal discountMultiplier = new BigDecimal(discountPercentage).divide(new BigDecimal(100));
        BigDecimal discountAmount = originalPrice.multiply(discountMultiplier);
        return originalPrice.subtract(discountAmount);
    }

}
