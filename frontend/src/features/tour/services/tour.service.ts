import { apiClient } from "@/services/apiClient";
import { getCategories } from "@/services/categoryService";
import { 
  MOCK_TOURS, MOCK_CATEGORIES, DESTINATIONS_LIST, DEPARTURES_LIST, DEPARTURES, REVIEWS,
  Tour, TourDeparture, Review, Category 
} from "@/constants/mockData";

export interface BackendTourImage {
  id: number;
  imageUrl?: string;
  url?: string;
}

export interface BackendTourDeparture {
  id: number;
  departureDate: string;
  returnDate?: string;
  price: number;
  totalSlot?: number;
  totalSlots?: number;
  availableSlot?: number;
  availableSlots?: number;
  status?: string;
}

export interface BackendCategory {
  id: number;
  name: string;
  description?: string;
}

export interface BackendTourResponse {
  id: number;
  name: string;
  description?: string;
  basePrice: number;
  departure: string;
  destination: string;
  duration: string;
  status: "AVAILABLE" | "FULL" | "CLOSED" | "DRAFT" | "CANCELLED";
  startDate?: string;
  endDate?: string;
  category?: BackendCategory;
  images?: BackendTourImage[];
  departures?: BackendTourDeparture[];
  createdAt?: string;
  updatedAt?: string;
}

const DEFAULT_TOUR_IMAGE = "https://images.unsplash.com/photo-1643029891412-92f9a81a8c16?w=800&h=500&fit=crop&auto=format";

export function mapTourResponseToTour(res: BackendTourResponse): Tour {
  const images = (res.images && res.images.length > 0)
    ? res.images.map(img => ({ id: img.id, url: img.imageUrl || img.url || DEFAULT_TOUR_IMAGE }))
    : [{ id: 1, url: DEFAULT_TOUR_IMAGE }];

  const departures: TourDeparture[] = (res.departures || []).map(d => ({
    id: d.id,
    tourId: res.id,
    departureDate: d.departureDate,
    returnDate: d.returnDate || d.departureDate,
    price: d.price ?? res.basePrice ?? 0,
    totalSlots: d.totalSlot ?? d.totalSlots ?? 20,
    availableSlots: d.availableSlot ?? d.availableSlots ?? 0,
    status: (d.status as any) || "OPEN"
  }));

  let normalizedStatus: Tour["status"] = "AVAILABLE";
  const rawStatus = String(res.status || "").toUpperCase();

  if (rawStatus === "DRAFT" || rawStatus === "INACTIVE" || rawStatus === "ARCHIVED" || rawStatus === "CLOSED") {
    normalizedStatus = "CLOSED";
  } else if (rawStatus === "FULL") {
    normalizedStatus = "FULL";
  } else {
    const totalSlots = departures.reduce((sum, d) => sum + d.availableSlots, 0);
    if (departures.length > 0 && totalSlots <= 0) {
      normalizedStatus = "FULL";
    } else {
      normalizedStatus = "AVAILABLE";
    }
  }

  return {
    id: res.id,
    name: res.name,
    categoryId: res.category?.id ?? 0,
    categoryName: res.category?.name ?? "Du lịch",
    description: res.description || "",
    basePrice: res.basePrice || 0,
    departure: res.departure || "",
    destination: res.destination || "",
    duration: res.duration || "",
    status: normalizedStatus,
    images,
    departures,
    averageRating: 4.8,
    reviewCount: 10,
    itinerary: [],
    ratingBreakdown: [
      { star: 5, percentage: 85 },
      { star: 4, percentage: 10 },
      { star: 3, percentage: 5 },
    ],
  };
}

export const tourService = {
  getTours: async (params?: { keyword?: string; categoryId?: number }): Promise<Tour[]> => {
    try {
      const response = await apiClient.get<BackendTourResponse[]>("/api/tours", { params });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data.map(mapTourResponseToTour);
      }
      return MOCK_TOURS;
    } catch (error) {
      console.warn("Failed to fetch tours from API, fallback to mock tours:", error);
      return MOCK_TOURS;
    }
  },
  
  getTourById: async (id: number): Promise<Tour | undefined> => {
    try {
      const response = await apiClient.get<BackendTourResponse>(`/api/tours/${id}`);
      if (response.data) {
        return mapTourResponseToTour(response.data);
      }
      return MOCK_TOURS.find(t => t.id === id);
    } catch (error) {
      console.warn(`Failed to fetch tour ${id} from API, fallback to mock tour:`, error);
      return MOCK_TOURS.find(t => t.id === id);
    }
  },
  
  getTourDepartures: async (tourId: number): Promise<TourDeparture[]> => {
    try {
      const tour = await tourService.getTourById(tourId);
      if (tour && tour.departures.length > 0) {
        return tour.departures;
      }
      return DEPARTURES.filter(d => d.tourId === tourId);
    } catch (error) {
      return DEPARTURES.filter(d => d.tourId === tourId);
    }
  },
  
  getTourReviews: async (tourId: number): Promise<Review[]> => {
    return REVIEWS.filter(r => r.tourId === tourId);
  },

  getFilterOptions: async (): Promise<{ categories: Category[]; destinations: string[]; departures: string[] }> => {
    try {
      const categories = await getCategories();
      const tours = await tourService.getTours();
      
      const apiDestinations = Array.from(new Set(tours.map(t => t.destination).filter(Boolean)));
      const apiDepartures = Array.from(new Set(tours.map(t => t.departure).filter(Boolean)));

      return {
        categories: categories.length > 0 ? categories : MOCK_CATEGORIES,
        destinations: apiDestinations.length > 0 ? apiDestinations : DESTINATIONS_LIST,
        departures: apiDepartures.length > 0 ? apiDepartures : DEPARTURES_LIST
      };
    } catch (error) {
      return {
        categories: MOCK_CATEGORIES,
        destinations: DESTINATIONS_LIST,
        departures: DEPARTURES_LIST
      };
    }
  }
};
