import { apiClient } from "@/services/apiClient"
import type { Review } from "@/services/reviewService"

export const adminReviewService = {
  getReviews: async (): Promise<Review[]> => {
    const response = await apiClient.get<Review[]>("/api/admin/reviews")
    return response.data
  },

  getReviewById: async (reviewId: number): Promise<Review> => {
    const response = await apiClient.get<Review>(`/api/admin/reviews/${reviewId}`)
    return response.data
  },

  deleteReview: async (reviewId: number): Promise<void> => {
    await apiClient.delete(`/api/admin/reviews/${reviewId}`)
  },
}
