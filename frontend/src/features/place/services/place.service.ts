import { MOCK_PLACES, Place } from "@/constants/mockData";

export const placeService = {
  getPlaces: async (): Promise<Place[]> => {
    return Promise.resolve([...MOCK_PLACES]);
  },
  
  getPlaceById: async (id: number): Promise<Place | undefined> => {
    return Promise.resolve(MOCK_PLACES.find(p => p.id === id));
  }
};
