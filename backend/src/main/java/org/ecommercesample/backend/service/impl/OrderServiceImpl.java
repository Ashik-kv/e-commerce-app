package org.ecommercesample.backend.service.impl;

import jakarta.transaction.Transactional;
import org.ecommercesample.backend.dto.OrderItemResponse;
import org.ecommercesample.backend.dto.OrderResponse;
import org.ecommercesample.backend.dto.UserDto;
import org.ecommercesample.backend.exceptions.*;
import org.ecommercesample.backend.model.*;
import org.ecommercesample.backend.repo.*;
import org.ecommercesample.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.ecommercesample.backend.model.OrderStatus.PENDING;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private AddressRepo addressRepo;

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private ProductRepo productRepo;

    @Override
    @Transactional
    public Order createOrder(Long userId, Long shippingAddressId) {
        Cart cart=cartRepo.findByUserId(userId).orElseThrow(() ->new CartNotFoundException("Cart not found for user ID:"+userId));
        if(cart.getCartItems()==null || cart.getCartItems().isEmpty()){
            throw new EmptyCartException("Cannot create an order from empty cart.");
        }
        Address shippingAddress=addressRepo.findById(shippingAddressId).orElseThrow(() -> new AddressNotFoundException("Shipping Address Not Found with ID:"+shippingAddressId));
        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();
            int requestedQuantity = cartItem.getQuantity();

            if (product.getStockQuantity() < requestedQuantity) {
                throw new InsufficientStockException(
                        "Insufficient stock for product: " + product.getName() +
                                ". Available: " + product.getStockQuantity() +
                                ", Requested: " + requestedQuantity
                );
            }
        }
        Order order=new Order();
        order.setUser(cart.getUser());
        order.setShippingAddress(shippingAddress);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(PENDING);
        List<OrderItem> orderItems=new ArrayList<>();
        BigDecimal totalPrice=BigDecimal.ZERO;
        for(CartItem cartItem:cart.getCartItems()){
            Product product=cartItem.getProduct();
            int requestedQuantity = cartItem.getQuantity();
            OrderItem orderItem=new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getDiscountedPrice());
            orderItem.setOrder(order);
            BigDecimal itemTotal=orderItem.getPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity()));
            totalPrice=totalPrice.add(itemTotal);
            orderItems.add(orderItem);
            int newStockQuantity=product.getStockQuantity()-requestedQuantity;
            product.setStockQuantity(newStockQuantity);
            if(newStockQuantity==0){
                product.setAvailable(false);
            }
            productRepo.save(product);
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

        UserDto userDto = new UserDto();
        userDto.setFirstName(order.getUser().getFirstName());
        userDto.setEmail(order.getUser().getEmail());
        orderResponse.setUser(userDto);

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

    @Transactional
    public void cancelOrder(Long orderId, Long userId) {
        Order order = orderRepo.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found"));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalStateException("Only pending orders can be cancelled");
        }

        // Restore stock for each item
        for (OrderItem orderItem : order.getOrderItems()) {
            Product product = orderItem.getProduct();
            int newStock = product.getStockQuantity() + orderItem.getQuantity();
            product.setStockQuantity(newStock);

            if (newStock > 0) {
                product.setAvailable(true);
            }

            productRepo.save(product);
            System.out.println("Stock restored for " + product.getName() + ": " + newStock);
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepo.save(order);
    }

    @Override
    public List<OrderResponse> getOrdersForSeller(Long sellerId) {
        List<Order> orders = orderRepo.findOrdersBySellerId(sellerId);
        return orders.stream()
                .map(this::mapOrderToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateOrderStatus(Long orderId, OrderStatus status, Long sellerId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Cannot change the status of a cancelled order.");
        }

        boolean isSellerProductInOrder = order.getOrderItems().stream()
                .anyMatch(item -> item.getProduct().getSeller().getId().equals(sellerId));

        if (!isSellerProductInOrder) {
            throw new ForbiddenException("You are not authorized to update this order.");
        }

        order.setStatus(status);
        orderRepo.save(order);
    }
}