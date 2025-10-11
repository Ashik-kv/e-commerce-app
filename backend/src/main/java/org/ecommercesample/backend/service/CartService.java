package org.ecommercesample.backend.service;

import org.ecommercesample.backend.dto.AddToCartRequest;
import org.ecommercesample.backend.dto.CartResponse;

public interface CartService {
    CartResponse getCart(Long userId);
    CartResponse addToCart(Long userId, AddToCartRequest request);
    CartResponse updateCartItem(Long userId, Long cartItemId, int quantity);
    void removeCartItem(Long userId, Long cartItemId);
}
