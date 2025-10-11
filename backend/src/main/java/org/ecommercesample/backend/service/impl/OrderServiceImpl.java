package org.ecommercesample.backend.service.impl;

import jakarta.transaction.Transactional;
import org.ecommercesample.backend.dto.OrderItemResponse;
import org.ecommercesample.backend.dto.OrderResponse;
import org.ecommercesample.backend.exceptions.AddressNotFoundException;
import org.ecommercesample.backend.exceptions.CartNotFoundException;
import org.ecommercesample.backend.exceptions.EmptyCartException;
import org.ecommercesample.backend.exceptions.OrderNotFoundException;
import org.ecommercesample.backend.model.*;
import org.ecommercesample.backend.repo.AddressRepo;
import org.ecommercesample.backend.repo.CartRepo;
import org.ecommercesample.backend.repo.OrderRepo;
import org.ecommercesample.backend.repo.UserRepo;
import org.ecommercesample.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.ecommercesample.backend.model.OrderStatus.PENDING;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private AddressRepo addressRepo;

    @Autowired
    private CartRepo cartRepo;

    @Override
    @Transactional
    public Order createOrder(Long userId, Long shippingAddressId) {
        Cart cart=cartRepo.findByUserId(userId).orElseThrow(() ->new CartNotFoundException("Cart not found for user ID:"+userId));
        if(cart.getCartItems()==null || cart.getCartItems().isEmpty()){
            throw new EmptyCartException("Cannot create an order from empty cart.");
        }
        Address shippingAddress=addressRepo.findById(shippingAddressId).orElseThrow(() -> new AddressNotFoundException("Shipping Address Not Found with ID:"+shippingAddressId));
        Order order=new Order();
        order.setUser(cart.getUser());
        order.setShippingAddress(shippingAddress);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(PENDING);
        List<OrderItem> orderItems=new ArrayList<>();
        BigDecimal totalPrice=BigDecimal.ZERO;
        for(CartItem cartItem:cart.getCartItems()){
            OrderItem orderItem=new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getDiscountedPrice());
            orderItem.setOrder(order);
            BigDecimal itemTotal=orderItem.getPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity()));
            totalPrice=totalPrice.add(itemTotal);
            orderItems.add(orderItem);
        }
        order.setOrderItems(orderItems);
        order.setTotalAmount(totalPrice);
        Order savedOrder=orderRepo.save(order);
        cart.getCartItems().clear();
        cartRepo.save(cart);
        return savedOrder;
    }

    @Override
    public List<OrderResponse> getOrderHistory(Long userId) {
        List<Order> orders=orderRepo.getOrdersByUserId(userId);
        List<OrderResponse> orderResponses=new ArrayList<>();
        for(Order order:orders){
            orderResponses.add(mapOrderToResponse(order));
        }
        return orderResponses;
    }

    @Override
    public OrderResponse getOrderById(Long orderId, Long userId) {
        Order order=orderRepo.findByIdAndUserId(orderId,userId)
                .orElseThrow(() -> new OrderNotFoundException("Order Not found with ID:"+orderId));
        return mapOrderToResponse(order);
    }

    private OrderResponse mapOrderToResponse(Order order) {
        OrderResponse orderResponse=new OrderResponse();
        orderResponse.setOrderId(order.getId());
        orderResponse.setOrderStatus(order.getStatus());
        orderResponse.setOrderDate(order.getOrderDate());
        orderResponse.setTotalAmount(order.getTotalAmount());
        orderResponse.setShippingAddress(order.getShippingAddress());
        List<OrderItemResponse>  itemResponses=new ArrayList<>();
        for(OrderItem orderItem:order.getOrderItems()){
            OrderItemResponse orderItemResponse=new OrderItemResponse();
            orderItemResponse.setId(orderItem.getId());
            orderItemResponse.setProductId(orderItem.getProduct().getId());
            orderItemResponse.setProductName(orderItem.getProduct().getName());
            orderItemResponse.setQuantity(orderItem.getQuantity());
            orderItemResponse.setPrice(orderItem.getPrice());
            BigDecimal subtotal=orderItem.getPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity()));
            orderItemResponse.setSubtotal(subtotal);
            itemResponses.add(orderItemResponse);
        }
        orderResponse.setOrderItems(itemResponses);
        return orderResponse;
    }
}
