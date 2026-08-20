package com.sunbooking.service;

import com.sunbooking.dto.tour.CategoryRequest;
import com.sunbooking.dto.tour.CategoryResponse;
import com.sunbooking.entity.Category;
import com.sunbooking.exception.ResourceNotFoundException;
import com.sunbooking.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll().stream()
                .map(CategoryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse findById(Long id) {
        return CategoryResponse.from(findCategory(id));
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        Category category = new Category();
        apply(category, request);
        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = findCategory(id);
        apply(category, request);
        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Transactional
    public void delete(Long id) {
        Category category = findCategory(id);
        categoryRepository.delete(category);
    }

    private Category findCategory(Long id) {
        return categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
    }

    private void apply(Category category, CategoryRequest request) {
        category.setName(request.name().trim());
        category.setDescription(request.description());
    }
}