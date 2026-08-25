package com.sunbooking.domain.tour.repository;

import com.sunbooking.domain.tour.entity.TourDeparture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TourDepartureRepository extends JpaRepository<TourDeparture, Long> {

    @Modifying
    @Query("UPDATE TourDeparture d SET d.availableSlot = d.availableSlot - :slots " +
            "WHERE d.id = :id AND d.availableSlot >= :slots")
    int deductAvailableSlots(Long id, int slots);

    @Modifying
    @Query("UPDATE TourDeparture d SET d.availableSlot = d.availableSlot + :slots WHERE d.id = :id")
    int addAvailableSlots(Long id, int slots);

    List<TourDeparture> findByTourIdOrderByDepartureDateAsc(Long tourId);

    @Query("SELECT d FROM TourDeparture d JOIN FETCH d.tour WHERE d.id = :id")
    Optional<TourDeparture> findByIdWithTour(@Param("id") Long id);
}