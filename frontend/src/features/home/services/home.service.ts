import { tourService } from "@/features/tour/services/tour.service";
import { getCategories } from "@/services/categoryService";
import { DEPARTURES_LIST, Tour, Category } from "@/constants/mockData";

export interface HomeData {
  featuredTours: Tour[];
  categories: Category[];
  departuresList: string[];
}

export const homeService = {
  getHomeData: async (): Promise<HomeData> => {
    try {
      const [tours, categories] = await Promise.all([
        tourService.getTours(),
        getCategories(),
      ]);

      const departuresList = Array.from(new Set([
        ...tours.map(t => t.departure).filter(Boolean),
        ...DEPARTURES_LIST
      ]));

      return {
        featuredTours: tours.slice(0, 6),
        categories,
        departuresList
      };
    } catch (error) {
      console.warn("Failed to load home data from API, using defaults:", error);
      const tours = await tourService.getTours();
      const categories = await getCategories();
      return {
        featuredTours: tours.slice(0, 6),
        categories,
        departuresList: DEPARTURES_LIST
      };
    }
  }
};
