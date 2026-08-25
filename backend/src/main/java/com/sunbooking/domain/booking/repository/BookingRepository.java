package com.sunbooking.domain.booking.repository;

import com.sunbooking.domain.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long>, JpaSpecificationExecutor<Booking> {

       boolean existsByDepartureId(Long departureId);

       boolean existsByUserIdAndDepartureIdAndStatusIn(Long userId, Long departureId, java.util.List<com.sunbooking.domain.booking.entity.BookingStatus> statuses);

       @Query("SELECT b FROM Booking b " +
                     "JOIN FETCH b.departure d " +
                     "JOIN FETCH d.tour " +
                     "JOIN FETCH b.user " +
                     "LEFT JOIN FETCH b.travelers " +
                     "WHERE b.user.id = :userId " +
                     "ORDER BY b.createdAt DESC")
       List<Booking> findByUserIdWithDetails(@Param("userId") Long userId);

       @Query("SELECT b FROM Booking b " +
                     "JOIN FETCH b.departure d " +
                     "JOIN FETCH d.tour " +
                     "JOIN FETCH b.user " +
                     "LEFT JOIN FETCH b.travelers " +
                     "WHERE b.id = :id")
       Optional<Booking> findByIdWithDetails(@Param("id") Long id);

       @Query("SELECT b.status, COUNT(b) FROM Booking b GROUP BY b.status")
       List<Object[]> countBookingsByStatus();
}
