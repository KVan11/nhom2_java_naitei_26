package com.sunbooking.domain.tour.repository;

import com.sunbooking.domain.tour.entity.Tour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TourRepository extends JpaRepository<Tour, Long> {

    boolean existsByCategoryId(Long categoryId);

    @EntityGraph(attributePaths = {"category"})
    @Query("select distinct t from Tour t "
        + "where (lower(t.name) like lower(concat('%', :keyword, '%')) "
        + "or lower(t.destination) like lower(concat('%', :keyword, '%'))) "
        + "and (:categoryId is null or t.category.id = :categoryId) "
        + "and t.status = com.sunbooking.domain.tour.entity.TourStatus.PUBLISHED")
    List<Tour> searchPublished(@Param("keyword") String keyword, @Param("categoryId") Long categoryId);

    @EntityGraph(attributePaths = {"category"})
    @Query("select distinct t from Tour t "
        + "where (lower(t.name) like lower(concat('%', :keyword, '%')) "
        + "or lower(t.destination) like lower(concat('%', :keyword, '%'))) "
        + "and (:categoryId is null or t.category.id = :categoryId)")
    List<Tour> search(@Param("keyword") String keyword, @Param("categoryId") Long categoryId);

    @EntityGraph(attributePaths = {"category"})
    @Query("select t from Tour t "
        + "where (lower(t.name) like lower(concat('%', :keyword, '%')) "
        + "or lower(t.destination) like lower(concat('%', :keyword, '%'))) "
        + "and (:categoryId is null or t.category.id = :categoryId)")
    Page<Tour> search(@Param("keyword") String keyword, @Param("categoryId") Long categoryId,
                      Pageable pageable);
}
