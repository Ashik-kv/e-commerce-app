package org.ecommercesample.backend.controller;

import org.ecommercesample.backend.dto.AddToCartRequest;
import org.ecommercesample.backend.dto.CartResponse;
import org.ecommercesample.backend.model.UserPrincipal;
import org.ecommercesample.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(cartService.getCart(userPrincipal.getUser().getId()));
    }

    @PostMapping
    public ResponseEntity<CartResponse> addToCart(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(userPrincipal.getUser().getId(), request));
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartResponse> updateCartItem(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable Long cartItemId, @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateCartItem(userPrincipal.getUser().getId(), cartItemId, quantity));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> removeCartItem(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable Long cartItemId) {
        cartService.removeCartItem(userPrincipal.getUser().getId(), cartItemId);
        return ResponseEntity.noContent().build();
    }
}
