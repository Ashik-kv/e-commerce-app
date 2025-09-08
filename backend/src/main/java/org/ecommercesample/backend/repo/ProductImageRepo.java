package org.ecommercesample.backend.repo;

import org.ecommercesample.backend.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductImageRepo extends JpaRepository<ProductImage,Long> {
}
