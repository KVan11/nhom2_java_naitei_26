import { MOCK_TOURS, MOCK_PLACES, MOCK_CATEGORIES, DEPARTURES_LIST, Tour, Place, Category } from "@/constants/mockData";

export interface HomeData {
  featuredTours: Tour[];
  popularPlaces: Place[];
  categories: Category[];
  departuresList: string[];
}

export const homeService = {
  getHomeData: async (): Promise<HomeData> => {
    return {
      featuredTours: MOCK_TOURS.slice(0, 6),
      popularPlaces: MOCK_PLACES.slice(0, 4),
      categories: MOCK_CATEGORIES,
      departuresList: DEPARTURES_LIST
    };
  }
};
