package org.ecommercesample.backend.controller;

import org.ecommercesample.backend.dto.ProductRequest;
import org.ecommercesample.backend.exceptions.ResourceNotFoundException;
import org.ecommercesample.backend.model.Category;
import org.ecommercesample.backend.model.Product;
import org.ecommercesample.backend.model.ProductImage;
import org.ecommercesample.backend.model.User;
import org.ecommercesample.backend.repo.CategoryRepo;
import org.ecommercesample.backend.repo.UserRepo;
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

@RestController
@RequestMapping("/api/seller/products")
@PreAuthorize("hasRole('SELLER')")
public class SellerController {

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private UserRepo userRepo;


    @PostMapping
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

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id,@RequestBody Product productDetails){
        try{
            Product updatedProduct=productService.updateProduct(id, productDetails);
            return ResponseEntity.ok(updatedProduct);
        }
        catch (ResourceNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id){
        try{
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        }
        catch (ResourceNotFoundException e){
            return ResponseEntity.notFound().build();
        }

    }
}
