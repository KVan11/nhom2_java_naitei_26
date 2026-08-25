package com.sunbooking.domain.booking.repository;

import com.sunbooking.domain.booking.dto.admin.AdminBookingFilter;
import com.sunbooking.domain.booking.entity.Booking;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;

public class BookingSpecification {

    public static Specification<Booking> filterBookings(AdminBookingFilter filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getBookingId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("id"), filter.getBookingId()));
            }

            if (filter.getStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), filter.getStatus()));
            }

            if (filter.getDepartureId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("departure").get("id"), filter.getDepartureId()));
            }

            if (filter.getTourId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("departure").get("tour").get("id"), filter.getTourId()));
            }

            if (filter.getDepartureDate() != null) {
                predicates.add(
                        criteriaBuilder.equal(root.get("departure").get("departureDate"), filter.getDepartureDate()));
            }

            if (StringUtils.hasText(filter.getSearchKeyword())) {
                String keyword = filter.getSearchKeyword().toLowerCase().trim();

                if (keyword.startsWith("#")) {
                    try {
                        Long id = Long.parseLong(keyword.substring(1));
                        predicates.add(criteriaBuilder.equal(root.get("id"), id));
                    } catch (NumberFormatException e) {
                        predicates.add(criteriaBuilder.equal(root.get("id"), -1L));
                    }
                } else {
                    String pattern = "%" + keyword + "%";

                    Predicate namePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("contactName")),
                            pattern);
                    Predicate phonePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("contactPhone")),
                            pattern);
                    Predicate emailPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("contactEmail")),
                            pattern);

                    Join<Object, Object> userJoin = root.join("user", JoinType.LEFT);
                    Predicate userEmailPredicate = criteriaBuilder.like(criteriaBuilder.lower(userJoin.get("email")),
                            pattern);
                    Predicate userFullNamePredicate = criteriaBuilder
                            .like(criteriaBuilder.lower(userJoin.get("fullName")), pattern);
                    Predicate userUsernamePredicate = criteriaBuilder
                            .like(criteriaBuilder.lower(userJoin.get("username")), pattern);

                    Predicate idPredicate = null;
                    try {
                        Long id = Long.parseLong(keyword);
                        idPredicate = criteriaBuilder.equal(root.get("id"), id);
                    } catch (NumberFormatException e) {
                    }

                    if (idPredicate != null) {
                        predicates.add(criteriaBuilder.or(namePredicate, phonePredicate, emailPredicate,
                                userEmailPredicate, userFullNamePredicate, userUsernamePredicate, idPredicate));
                    } else {
                        predicates.add(criteriaBuilder.or(namePredicate, phonePredicate, emailPredicate,
                                userEmailPredicate, userFullNamePredicate, userUsernamePredicate));
                    }
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
