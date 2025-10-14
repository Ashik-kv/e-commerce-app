package org.ecommercesample.backend.dto;

import lombok.Data;
import org.ecommercesample.backend.model.Address;
import org.ecommercesample.backend.model.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long orderId;
    private LocalDateTime orderDate;
    private OrderStatus orderStatus;
    private BigDecimal totalAmount;
    private List<OrderItemResponse> orderItems;
    private Address shippingAddress;
    private UserDto user;
}
