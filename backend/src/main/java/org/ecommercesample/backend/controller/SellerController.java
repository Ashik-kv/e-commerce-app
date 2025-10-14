package org.ecommercesample.backend.controller;

import org.ecommercesample.backend.dto.OrderResponse;
import org.ecommercesample.backend.dto.ProductRequest;
import org.ecommercesample.backend.exceptions.ResourceNotFoundException;
import org.ecommercesample.backend.model.*;
import org.ecommercesample.backend.repo.CategoryRepo;
import org.ecommercesample.backend.repo.UserRepo;
import org.ecommercesample.backend.service.OrderService;
import org.ecommercesample.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seller")
@PreAuthorize("hasRole('SELLER')")
public class SellerController {

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private OrderService orderService;


    @PostMapping("/products")
    public ResponseEntity<Product> addProduct(@RequestPart("product")ProductRequest productRequest,
                                              @RequestPart("images")List<MultipartFile> images,
                                              @AuthenticationPrincipal UserDetails userDetails) throws IOException {


        User seller=userRepo.findByEmail(userDetails.getUsername());

        if(seller==null){
            return ResponseEntity.status(403).build();
        }

        Category category=categoryRepo.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Product product=Product.builder()
                .name(productRequest.getName())
                .brand(productRequest.getBrand())
                .description(productRequest.getDescription())
                .originalPrice(productRequest.getOriginalPrice())
                .discountPercentage(productRequest.getDiscountPercentage())
                .stockQuantity(productRequest.getStockQuantity())
                .mfgDate(productRequest.getMfgDate())
                .available(productRequest.getAvailable())
                .category(category)
                .seller(seller)
                .build();

        List<ProductImage> productImages = new ArrayList<>();
        for (MultipartFile imageFile : images) {
            ProductImage productImage = ProductImage.builder()
                    .imageName(imageFile.getOriginalFilename())
                    .imageType(imageFile.getContentType())
                    .imageFile(imageFile.getBytes())
                    .product(product)
                    .build();
            productImages.add(productImage);
        }

        product.setImages(productImages);

        Product savedProduct = productService.saveProduct(product);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedProduct.getId())
                .toUri();

        return ResponseEntity.created(location).body(savedProduct);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id,@RequestBody Product productDetails){
        try{
            Product updatedProduct=productService.updateProduct(id, productDetails);
            return ResponseEntity.ok(updatedProduct);
        }
        catch (ResourceNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id){
        try{
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        }
        catch (ResourceNotFoundException e){
            return ResponseEntity.notFound().build();
        }

    }
    @PutMapping("/products/{productId}/stock/increase")
    public ResponseEntity<Map<String, Object>> increaseStock(
            @PathVariable Long productId,
            @RequestParam int quantity) {

        if (quantity <= 0) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Quantity must be greater than 0"
            ));
        }

        try {
            productService.increaseStock(productId, quantity);
            Product updatedProduct = productService.getProductById(productId);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Stock increased successfully",
                    "productId", productId,
                    "newStockQuantity", updatedProduct.getStockQuantity(),
                    "isAvailable", updatedProduct.getAvailable()
            ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @PutMapping("/products/{productId}/stock/reduce")
    public ResponseEntity<Map<String, Object>> reduceStock(
            @PathVariable Long productId,
            @RequestParam int quantity) {

        if (quantity <= 0) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Quantity must be greater than 0"
            ));
        }

        try {
            productService.reduceStock(productId, quantity);
            Product updatedProduct = productService.getProductById(productId);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Stock reduced successfully",
                    "productId", productId,
                    "newStockQuantity", updatedProduct.getStockQuantity(),
                    "isAvailable", updatedProduct.getAvailable()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }


    @PutMapping("/products/{productId}/stock")
    public ResponseEntity<Map<String, Object>> setStockQuantity(
            @PathVariable Long productId,
            @RequestParam int quantity) {

        if (quantity < 0) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Quantity cannot be negative"
            ));
        }

        try {
            Product product = productService.getProductById(productId);
            product.setStockQuantity(quantity);
            product.setAvailable(quantity > 0);

            Product updatedProduct = productService.saveProduct(product);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Stock quantity updated successfully",
                    "productId", productId,
                    "newStockQuantity", updatedProduct.getStockQuantity(),
                    "isAvailable", updatedProduct.getAvailable()
            ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getSellerOrders(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long sellerId = userPrincipal.getUser().getId();
        return ResponseEntity.ok(orderService.getOrdersForSeller(sellerId));
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            orderService.updateOrderStatus(orderId, status, userPrincipal.getUser().getId());
            return ResponseEntity.ok(Map.of("message", "Order status updated successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
