package org.ecommercesample.backend.controller;

import org.ecommercesample.backend.exceptions.ResourceNotFoundException;
import org.ecommercesample.backend.model.Product;
import org.ecommercesample.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    
    private ProductService productService;

    @GetMapping
    public List<Product> viewAllProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String keyword,
            // ✨ ADD THIS LINE
            @RequestParam(required = false) Boolean available) {

//        boolean hasFilters = (categoryId != null)
//                || (minPrice != null)
//                || (maxPrice != null)
//                || (brand != null && !brand.trim().isEmpty())
//                || (keyword != null && !keyword.trim().isEmpty())
//                // ✨ ADD THIS LINE
//                || (available != null);
//
//        if (hasFilters) {
//            // ✨ UPDATE THIS LINE to pass the 'available' parameter
//            return productService.getFilteredProducts(categoryId, minPrice, maxPrice, keyword, brand, available);
//
//        }
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> viewProductById(@PathVariable Long id){
        try{
            Product product=productService.getProductById(id);
            return ResponseEntity.ok(product);
        }
        catch (ResourceNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search/{keyword}")
    public ResponseEntity<List<Product>> searchProductByKeyword(@PathVariable String keyword){
        try{
            List<Product> product=productService.getProductByKeyword(keyword);
            return ResponseEntity.ok(product);
        }
        catch (ResourceNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

}

