import { 
  MOCK_TOURS, MOCK_CATEGORIES, DESTINATIONS_LIST, DEPARTURES_LIST, DEPARTURES, REVIEWS,
  Tour, TourDeparture, Review, Category 
} from "@/constants/mockData";

export const tourService = {
  getTours: async (): Promise<Tour[]> => {
    return MOCK_TOURS;
  },
  
  getTourById: async (id: number): Promise<Tour | undefined> => {
    return MOCK_TOURS.find(t => t.id === id);
  },
  
  getTourDepartures: async (tourId: number): Promise<TourDeparture[]> => {
    return DEPARTURES.filter(d => d.tourId === tourId);
  },
  
  getTourReviews: async (tourId: number): Promise<Review[]> => {
    return REVIEWS.filter(r => r.tourId === tourId);
  },

  getFilterOptions: async (): Promise<{ categories: Category[], destinations: string[], departures: string[] }> => {
    return {
      categories: MOCK_CATEGORIES,
      destinations: DESTINATIONS_LIST,
      departures: DEPARTURES_LIST
    };
  }
};
