package org.ecommercesample.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProductController {

    @GetMapping("products")
    public List<Product> viewAllProducts(){

    }

}
