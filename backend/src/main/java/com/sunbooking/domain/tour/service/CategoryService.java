package com.sunbooking.domain.tour.service;

import com.sunbooking.domain.tour.dto.CategoryRequest;
import com.sunbooking.domain.tour.dto.CategoryResponse;
import com.sunbooking.domain.tour.entity.Category;
import com.sunbooking.global.exception.ResourceNotFoundException;
import com.sunbooking.domain.tour.repository.CategoryRepository;
import com.sunbooking.domain.tour.repository.TourRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final TourRepository tourRepository;

    public CategoryService(CategoryRepository categoryRepository, TourRepository tourRepository) {
        this.categoryRepository = categoryRepository;
        this.tourRepository = tourRepository;
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
        if (tourRepository.existsByCategoryId(id)) {
            throw new IllegalArgumentException("Cannot delete category as it is currently associated with active tours.");
        }
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