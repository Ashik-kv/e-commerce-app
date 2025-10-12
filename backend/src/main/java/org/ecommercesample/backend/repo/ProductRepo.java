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
    List<Product> findByCategory(Category category);


    List<Product> findByCategoryId(Long categoryId);


    List<Product> findByAvailableTrue();

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.seller WHERE p.id = :id")
    Optional<Product> findByIdWithCategoryAndSeller(@Param("id") Long id);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.seller")
    List<Product> findAllWithCategoryAndSeller();

    // Find products by category and availability
    List<Product> findByCategoryAndAvailableTrue(Category category);

    // Find products with stock greater than specified amount
    List<Product> findByStockQuantityGreaterThan(Integer stockQuantity);

    // Search products by name or description (case insensitive)
    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);


    List<Product> findByBrandContainingIgnoreCase(String brand);

    // Find products within price range
    @Query("SELECT p FROM Product p WHERE (p.originalPrice * (1 - COALESCE(p.discountPercentage, 0) / 100.0)) BETWEEN :minPrice AND :maxPrice AND p.available = true")
    List<Product> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);

    // Find products by category name
    @Query("SELECT p FROM Product p JOIN p.category c WHERE LOWER(c.categoryName) = LOWER(:categoryName)")
    List<Product> findByCategoryName(@Param("categoryName") String categoryName);

    // Find top products by category (most recent or highest rated - depending on your needs)
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.available = true ORDER BY p.id DESC")
    List<Product> findTopProductsByCategory(@Param("categoryId") Long categoryId);

    // Find products on discount
    @Query("SELECT p FROM Product p WHERE p.discountPercentage > 0 AND p.available = true")
    List<Product> findDiscountedProducts();

    // Find products by multiple criteria
    @Query("SELECT p FROM Product p WHERE " +
            "(:categoryId IS NULL OR p.category.id = :categoryId) AND" +
            "(:minPrice IS NULL OR (p.originalPrice * (1 - COALESCE(p.discountPercentage, 0) / 100.0)) >= :minPrice) AND " +
            "(:maxPrice IS NULL OR (p.originalPrice * (1 - COALESCE(p.discountPercentage, 0) / 100.0)) <= :maxPrice) AND " +
            "(:available IS NULL OR p.available = :available) AND " +
            "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:brand IS NULL OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :brand, '%')))")
    List<Product> findProductsByCriteria(
            @Param("categoryId") Long categoryId,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("available") Boolean available,
            @Param("keyword") String keyword,
            @Param("brand") String brand
    );

    // Count products by category
    @Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = :categoryId")
    Long countProductsByCategory(@Param("categoryId") Long categoryId);

    // Find products by seller (if you have seller relationship)
    // List<Product> findBySellerId(Long sellerId);

    // Find featured products (you can define your own criteria)
    @Query("SELECT p FROM Product p WHERE p.available = true AND p.stockQuantity > 0 ORDER BY p.discountPercentage DESC")
    List<Product> findFeaturedProducts();

    // Find product by keyword
    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Optional<Product> findByKeyword(@Param("keyword") String keyword);
}
