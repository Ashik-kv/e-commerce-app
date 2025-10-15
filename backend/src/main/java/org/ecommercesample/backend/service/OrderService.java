package org.ecommercesample.backend.service;

import org.ecommercesample.backend.dto.OrderResponse;
import org.ecommercesample.backend.model.Order;
import org.ecommercesample.backend.model.OrderStatus;

import java.util.List;

public interface OrderService {
    Order createOrder(Long userId, Long shippingAddresId);
    List<OrderResponse> getOrderHistory(Long userId);
    OrderResponse getOrderById(Long orderId, Long userId);
    void cancelOrder(Long orderId, Long userId);
    List<OrderResponse> getOrdersForSeller(Long sellerId);
    void updateOrderStatus(Long orderId, OrderStatus orderStatus, Long sellerId);
    List<OrderResponse> getAllOrders();
}
