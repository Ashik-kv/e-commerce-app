package org.ecommercesample.backend.service;

import org.ecommercesample.backend.dto.OrderResponse;
import org.ecommercesample.backend.model.Order;

import java.util.List;

public interface OrderService {
    Order createOrder(Long userId, Long shippingAddresId);
    List<OrderResponse> getOrderHistory(Long userId);
    OrderResponse getOrderById(Long orderId, Long userId);
    void cancelOrder(Long orderId, Long userId);
}
