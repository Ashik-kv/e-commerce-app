package org.ecommercesample.backend.repo;

import org.ecommercesample.backend.model.Order;
import org.ecommercesample.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepo extends JpaRepository<Order, Long> {
    List<Order> getOrdersByUserId(Long userId);


    Optional<Order> findByIdAndUserId(Long orderId, Long userId);

    Long user(User user);
}
