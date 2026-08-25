package com.sunbooking.domain.tour.service;

import com.sunbooking.domain.tour.dto.TourRequest;
import com.sunbooking.domain.tour.dto.TourResponse;
import com.sunbooking.domain.tour.entity.Category;
import com.sunbooking.domain.tour.entity.TourDeparture;
import com.sunbooking.domain.tour.entity.TourImage;
import com.sunbooking.domain.tour.entity.Tour;
import com.sunbooking.domain.tour.entity.TourStatus;
import com.sunbooking.global.exception.ResourceNotFoundException;
import com.sunbooking.domain.booking.entity.Booking;
import com.sunbooking.domain.booking.repository.BookingRepository;
import com.sunbooking.domain.tour.repository.CategoryRepository;
import com.sunbooking.domain.tour.repository.TourRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class TourService {

    private final TourRepository tourRepository;
    private final CategoryRepository categoryRepository;
    private final BookingRepository bookingRepository;

    public TourService(TourRepository tourRepository, CategoryRepository categoryRepository,
                       BookingRepository bookingRepository) {
        this.tourRepository = tourRepository;
        this.categoryRepository = categoryRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public List<TourResponse> search(String keyword, Long categoryId) {
        String normalizedKeyword = normalizeKeyword(keyword);
        return tourRepository.searchPublished(normalizedKeyword, categoryId).stream()
                .map(TourResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<TourResponse> search(String keyword, Long categoryId, Pageable pageable) {
        String normalizedKeyword = normalizeKeyword(keyword);
        return tourRepository.search(normalizedKeyword, categoryId, pageable)
                .map(TourResponse::from);
    }

    private String normalizeKeyword(String keyword) {
        return keyword == null || keyword.isBlank() ? "" : keyword.trim();
    }

    @Transactional(readOnly = true)
    public TourResponse findById(Long id) {
        return TourResponse.from(findTour(id));
    }

    @Transactional
    public TourResponse create(TourRequest request) {
        Tour tour = new Tour();
        apply(tour, request);
        return TourResponse.from(tourRepository.save(tour));
    }

    @Transactional
    public TourResponse update(Long id, TourRequest request) {
        Tour tour = findTour(id);
        apply(tour, request);
        return TourResponse.from(tourRepository.save(tour));
    }

    @Transactional
    public void delete(Long id) {
        Tour tour = findTour(id);
        tour.setStatus(TourStatus.INACTIVE);
        tourRepository.save(tour);
    }

    private Tour findTour(Long id) {
        return tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found: " + id));
    }

    private void apply(Tour tour, TourRequest request) {
        if (request.startDate().toLocalDate().isBefore(java.time.LocalDate.now())) {
            throw new IllegalArgumentException("Start Date must be from today onwards");
        }
        if (request.startDate().isAfter(request.endDate())) {
            throw new IllegalArgumentException("Start Date must not be after End Date");
        }
        if (request.basePrice() != null && request.basePrice().compareTo(java.math.BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Base price must not be negative");
        }

        tour.setName(request.name().trim());
        tour.setDescription(request.description());
        tour.setBasePrice(request.basePrice());
        tour.setDeparture(request.departure());
        tour.setDestination(request.destination());
        tour.setDuration(request.duration());
        tour.setStatus(request.status());
        tour.setStartDate(request.startDate());
        tour.setEndDate(request.endDate());
        tour.setCategory(resolveCategory(request.categoryId()));
        updateImages(tour, request.images());
        updateDepartures(tour, request.departures());
    }

    private void updateImages(Tour tour, List<TourRequest.TourImageRequest> requests) {
        if (requests == null) {
            return;
        }
        tour.getImages().clear();
        requests.forEach(request -> {
            TourImage image = new TourImage();
            image.setImageUrl(request.imageUrl().trim());
            image.setTour(tour);
            tour.getImages().add(image);
        });
    }

    private void updateDepartures(Tour tour, List<TourRequest.TourDepartureRequest> requests) {
        if (requests == null) {
            return;
        }

        Map<Long, TourDeparture> existingById = tour.getDepartures().stream()
                .filter(departure -> departure.getId() != null)
                .collect(Collectors.toMap(TourDeparture::getId, Function.identity()));
        Set<Long> requestedIds = requests.stream()
                .map(TourRequest.TourDepartureRequest::id)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        tour.getDepartures().removeIf(departure -> canRemoveDeparture(departure, requestedIds));
        requests.forEach(request -> applyDeparture(tour, existingById, request));
    }

    private boolean canRemoveDeparture(TourDeparture departure, Set<Long> requestedIds) {
        Long departureId = departure.getId();
        if (departureId == null || requestedIds.contains(departureId)) {
            return false;
        }
        return !bookingRepository.existsByDepartureId(departureId);
    }

    private void applyDeparture(Tour tour, Map<Long, TourDeparture> existingById,
                                TourRequest.TourDepartureRequest request) {
        if (request.departureDate().isBefore(java.time.LocalDate.now())) {
            throw new IllegalArgumentException("Departure Date must be from today onwards");
        }
        if (request.departureDate().isAfter(request.returnDate())) {
            throw new IllegalArgumentException("Departure Date must not be after Return Date");
        }
        if (request.totalSlot() == null || request.totalSlot() <= 0) {
            throw new IllegalArgumentException("Total Slots must be greater than 0");
        }
        if (request.availableSlot() == null || request.availableSlot() < 0) {
            throw new IllegalArgumentException("Available Slots must not be negative");
        }
        if (request.availableSlot() > request.totalSlot()) {
            throw new IllegalArgumentException("Available Slots must not exceed Total Slots");
        }
        if (request.price() != null && request.price().compareTo(java.math.BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Departure price must not be negative");
        }

        TourDeparture departure = request.id() == null ? new TourDeparture() : existingById.get(request.id());
        if (departure == null) {
            throw new ResourceNotFoundException("Tour departure not found: " + request.id());
        }
        departure.setDepartureDate(request.departureDate());
        departure.setReturnDate(request.returnDate());
        departure.setPrice(request.price());
        departure.setTotalSlot(request.totalSlot());
        departure.setAvailableSlot(request.availableSlot());
        departure.setStatus(request.status());
        departure.setTour(tour);
        if (request.id() == null) {
            tour.getDepartures().add(departure);
        }
    }

    private Category resolveCategory(Long categoryId) {
        if (categoryId == null) {
            return null;
        }
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categoryId));
    }
}
