package org.ecommercesample.backend.controller;


import org.ecommercesample.backend.dto.OrderResponse;
import org.ecommercesample.backend.dto.createOrderRequest;
import org.ecommercesample.backend.model.Order;
import org.ecommercesample.backend.model.UserPrincipal;
import org.ecommercesample.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/orders")
    public ResponseEntity<OrderResponse> createOrder(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody createOrderRequest request) {
        Long userId=userPrincipal.getUser().getId();
        Order createdOrder = orderService.createOrder(userId, request.getShippingAddressId());
        OrderResponse orderResponse =orderService.getOrderById(createdOrder.getId(),userId);
        return new ResponseEntity<>(orderResponse, HttpStatus.CREATED);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getOrderHistory(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId=userPrincipal.getUser().getId();
        List<OrderResponse> orderHistory = orderService.getOrderHistory(userId);
        return ResponseEntity.ok(orderHistory);
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@AuthenticationPrincipal UserPrincipal userPrincipal,@PathVariable Long orderId) {
        Long userId=userPrincipal.getUser().getId();
        return ResponseEntity.ok(orderService.getOrderById(orderId,userId));
    }
}
