package org.ecommercesample.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    @NotBlank
    private String imageName;
    @Column(nullable = false)
    @NotBlank
    private String imageType;
    @Column(nullable = false, columnDefinition = "BYTEA")
    private byte[] imageFile;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="product_id",nullable = false)
    @ToString.Exclude
    @JsonIgnore
    private Product product;
}
