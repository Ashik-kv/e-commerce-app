package org.ecommercesample.backend.service;


import org.ecommercesample.backend.model.Category;
import org.ecommercesample.backend.repo.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CategoryService {

    @Autowired
    private CategoryRepo categoryRepository;

    // Get all categories ordered by name
    public List<Category> getAllCategories() {
        System.out.println("--- Fetching categories from the database... ---");

        List<Category> categories = categoryRepository.findAllByOrderByCategoryNameAsc();

        // --- PRINT STATEMENT TO SHOW THE FETCHED DATA ---
        System.out.println("--- Found " + categories.size() + " categories: ---");
        for (Category category : categories) {
            System.out.println("ID: " + category.getId() + ", Name: " + category.getCategoryName());
        }

        return categories;
    }

    // Get category by ID
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    // Get category by name
    public Optional<Category> getCategoryByName(String categoryName) {
        return categoryRepository.findByCategoryName(categoryName);
    }

    // Create new category
    public Category createCategory(Category category) {
        // Check if category name already exists
        if (categoryRepository.existsByCategoryNameIgnoreCase(category.getCategoryName())) {
            throw new RuntimeException("Category with name '" + category.getCategoryName() + "' already exists");
        }
        return categoryRepository.save(category);
    }

    // Update category
    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        // Check if new name conflicts with existing category (excluding current one)
        if (!category.getCategoryName().equalsIgnoreCase(categoryDetails.getCategoryName()) &&
                categoryRepository.existsByCategoryNameIgnoreCase(categoryDetails.getCategoryName())) {
            throw new RuntimeException("Category with name '" + categoryDetails.getCategoryName() + "' already exists");
        }

        category.setCategoryName(categoryDetails.getCategoryName());
        return categoryRepository.save(category);
    }

    // Delete category
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        // Check if category has products
        if (category.getProducts() != null && !category.getProducts().isEmpty()) {
            throw new RuntimeException("Cannot delete category that has products. Please reassign or delete products first.");
        }

        categoryRepository.deleteById(id);
    }

    // Search categories by keyword
    public List<Category> searchCategories(String keyword) {
        return categoryRepository.searchByKeyword(keyword);
    }

    // Check if category exists
    public boolean categoryExists(Long id) {
        return categoryRepository.existsById(id);
    }

    // Get category with products count
    @Transactional(readOnly = true)
    public List<Category> getCategoriesWithProductCount() {
        List<Category> categories = categoryRepository.findAllByOrderByCategoryNameAsc();
        // The product count will be available through the products list size
        // since we have the relationship mapped
        return categories;
    }
}

