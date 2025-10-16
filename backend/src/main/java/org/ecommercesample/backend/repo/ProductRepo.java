package org.ecommercesample.backend.repo;

import org.ecommercesample.backend.model.Category;
import org.ecommercesample.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepo extends JpaRepository<Product,Long> {

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.seller WHERE p.id = :id")
    Optional<Product> findByIdWithCategoryAndSeller(@Param("id") Long id);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.seller")
    List<Product> findAllWithCategoryAndSeller();

    List<Product> findByStockQuantityGreaterThan(Integer stockQuantity);

    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.available = true ORDER BY p.id DESC")
    List<Product> findTopProductsByCategory(@Param("categoryId") Long categoryId);

    @Query("SELECT p FROM Product p WHERE p.discountPercentage > 0 AND p.available = true")
    List<Product> findDiscountedProducts();


    @Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = :categoryId")
    Long countProductsByCategory(@Param("categoryId") Long categoryId);

    List<Product> findBySellerId(Long sellerId);

    @Query("SELECT p FROM Product p WHERE p.available = true AND p.stockQuantity > 0 ORDER BY p.discountPercentage DESC")
    List<Product> findFeaturedProducts();

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.seller WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.category.categoryName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> findByKeyword(@Param("keyword") String keyword);
}