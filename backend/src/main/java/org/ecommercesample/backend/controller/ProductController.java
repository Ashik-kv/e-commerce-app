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
    public List<Product> viewAllProducts() {
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

