package org.ecommercesample.backend.controller;

import org.ecommercesample.backend.model.Product;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seller")
@PreAuthorize("hasRole('SELLER')")
public class SellerController {
    @PostMapping("/products")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
//        return ResponseEntity.ok();
        return null;
    }

    @PutMapping("/products/{productId}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long productId, @RequestBody Product productDetails) {
//        return ResponseEntity.ok(Product);
        return null;
    }
}
