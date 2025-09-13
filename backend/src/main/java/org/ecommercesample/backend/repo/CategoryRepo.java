package org.ecommercesample.backend.repo;

import org.ecommercesample.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepo extends JpaRepository<Category, Long> {

    Optional<Category> findByCategoryName(String categoryName);


    @Query("SELECT COUNT(c) > 0 FROM Category c WHERE LOWER(c.categoryName) = LOWER(?1)")
    boolean existsByCategoryNameIgnoreCase(String categoryName);


    @Query("SELECT c FROM Category c WHERE LOWER(c.categoryName) LIKE LOWER(CONCAT('%', ?1, '%'))")
    List<Category> searchByKeyword(String keyword);


    List<Category> findAllByOrderByCategoryNameAsc();
}
