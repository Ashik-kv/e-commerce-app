package org.ecommercesample.backend.service.impl;

import org.ecommercesample.backend.dto.AddToCartRequest;
import org.ecommercesample.backend.dto.CartItemResponse;
import org.ecommercesample.backend.dto.CartResponse;
import org.ecommercesample.backend.exceptions.InsufficientStockException;
import org.ecommercesample.backend.exceptions.ResourceNotFoundException;
import org.ecommercesample.backend.model.Cart;
import org.ecommercesample.backend.model.CartItem;
import org.ecommercesample.backend.model.Product;
import org.ecommercesample.backend.model.User;
import org.ecommercesample.backend.repo.CartItemRepo;
import org.ecommercesample.backend.repo.CartRepo;
import org.ecommercesample.backend.repo.ProductRepo;
import org.ecommercesample.backend.repo.UserRepo;
import org.ecommercesample.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private CartItemRepo cartItemRepo;

    @Override
    public CartResponse getCart(Long userId) {
        Cart cart = cartRepo.findByUserId(userId).orElseGet(() -> createCart(userId));
        return mapCartToResponse(cart);
    }

    @Override
    public CartResponse addToCart(Long userId, AddToCartRequest request) {
        Cart cart = cartRepo.findByUserId(userId).orElseGet(() -> createCart(userId));
        Product product = productRepo.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.getProductId()))
                .findFirst()
                .orElse(null);

        int newQuantity = request.getQuantity();
        if (cartItem != null) {
            newQuantity += cartItem.getQuantity();
        }
        if(product.getStockQuantity()<newQuantity){
            throw new InsufficientStockException("Not Enough Stock for product"+product.getName());
        }
        if (cartItem != null) {
            cartItem.setQuantity(newQuantity);
        } else {
            cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(request.getQuantity());
            cart.getCartItems().add(cartItem);
        }

        cartRepo.save(cart);
        return mapCartToResponse(cart);
    }

    @Override
    public CartResponse updateCartItem(Long userId, Long cartItemId, int quantity) {
        Cart cart = cartRepo.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        CartItem cartItem = cartItemRepo.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new SecurityException("Cart item does not belong to this user");
        }
        Product product=cartItem.getProduct();
        if(product.getStockQuantity()<quantity){
            throw new InsufficientStockException("Not Enough Stock for product"+product.getName());
        }
        cartItem.setQuantity(quantity);
        cartItemRepo.save(cartItem);
        Cart updatedCart = cartRepo.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        return mapCartToResponse(updatedCart);
    }

    @Override
    public void removeCartItem(Long userId, Long cartItemId) {
        Cart cart = cartRepo.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        CartItem cartItem = cartItemRepo.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new SecurityException("Cart item does not belong to this user");
        }

        cartItemRepo.delete(cartItem);
    }

    private Cart createCart(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepo.save(cart);
    }

    private CartResponse mapCartToResponse(Cart cart) {
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setTotalPrice(cart.getTotalPrice());
        response.setCartItems(cart.getCartItems().stream().map(this::mapCartItemToResponse).collect(Collectors.toList()));
        return response;
    }

    private CartItemResponse mapCartItemToResponse(CartItem cartItem) {
        CartItemResponse response = new CartItemResponse();
        response.setId(cartItem.getId());
        response.setProductId(cartItem.getProduct().getId());
        response.setProductName(cartItem.getProduct().getName());
        response.setQuantity(cartItem.getQuantity());
        response.setPrice(cartItem.getProduct().getDiscountedPrice());
        response.setSubtotal(cartItem.getSubtotal());
        response.setProduct(cartItem.getProduct());
        return response;
    }
}
