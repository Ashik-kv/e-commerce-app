package org.ecommercesample.backend.service;

import org.ecommercesample.backend.exceptions.ResourceNotFoundException;
import org.ecommercesample.backend.model.Product;
import org.ecommercesample.backend.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ProductService {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private CategoryService categoryService;

    public List<Product> getAllProducts(){
        return productRepo.findAllWithCategoryAndSeller();
    }

    public Product getProductById(long productId){
        return productRepo.findByIdWithCategoryAndSeller(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
    }

    public Product saveProduct(Product product){
        return productRepo.save(product);
    }

    public Product updateProduct(Long productId,Product productDetails){
        Product existingProduct = getProductById(productId);
        if(productDetails.getName() != null){
            existingProduct.setName(productDetails.getName());
        }
        if(productDetails.getDescription() != null){
            existingProduct.setDescription(productDetails.getDescription());
        }
        if(productDetails.getBrand() != null){
            existingProduct.setBrand(productDetails.getBrand());
        }
        if(productDetails.getCategory() != null){
            existingProduct.setCategory(productDetails.getCategory());
        }
        if(productDetails.getDiscountPercentage() != null){
            existingProduct.setDiscountPercentage(productDetails.getDiscountPercentage());
        }
        if (productDetails.getImages() != null && !productDetails.getImages().isEmpty()) {
            existingProduct.getImages().clear();
            existingProduct.getImages().addAll(productDetails.getImages());
        }
        if(productDetails.getAvailable() != null){
            existingProduct.setAvailable(productDetails.getAvailable());
        }
        if(productDetails.getOriginalPrice()!= null){
            existingProduct.setOriginalPrice(productDetails.getOriginalPrice());
        }
        if(productDetails.getStockQuantity()!=null){
            existingProduct.setStockQuantity(productDetails.getStockQuantity());
        }
        return productRepo.save(existingProduct);
    }

    public void deleteProduct(Long productId){
         if(!productRepo.existsById(productId)){
             throw new ResourceNotFoundException("Product not found with id: " + productId);
         }
         productRepo.deleteById(productId);
    }

}
