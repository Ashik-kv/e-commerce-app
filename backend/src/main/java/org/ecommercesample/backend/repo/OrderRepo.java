package org.ecommercesample.backend.repo;

import org.ecommercesample.backend.model.Order;
import org.ecommercesample.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepo extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);


    Optional<Order> findByIdAndUserId(Long orderId, Long userId);

    Long user(User user);

    @Query("SELECT o FROM Order o JOIN o.orderItems oi WHERE oi.product.seller.id = :sellerId GROUP BY o.id ORDER BY CASE WHEN o.status = 'CANCELLED' OR o.status = 'DELIVERED' THEN 1 ELSE 0 END ASC, o.orderDate DESC")
    List<Order> findOrdersBySellerId(@Param("sellerId") Long sellerId);
}
