package org.ecommercesample.backend.repo;

import org.ecommercesample.backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepo extends JpaRepository<OrderItem,Long> {
}
