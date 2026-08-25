import axios from "axios"

import { apiClient } from "@/services/apiClient"

export type ReviewImage = {
  id: number
  imageUrl: string
  createdAt: string
}

export type Review = {
  id: number
  bookingId: number
  tourId: number
  tourName: string
  userId: number
  reviewerName: string | null
  reviewerAvatar: string | null
  content: string
  rating: number
  images: ReviewImage[]
  createdAt: string
  updatedAt: string
}

export type CreateReviewRequest = {
  bookingId: number
  content: string
  rating: number
  imageUrls?: string[]
}

export type UpdateReviewRequest = {
  content: string
  rating: number
  imageUrls?: string[]
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; details?: Record<string, string> }
      | undefined

    if (data?.message) {
      return data.message
    }
    if (data?.details) {
      return Object.values(data.details).join(", ")
    }
  }

  return error instanceof Error && error.message ? error.message : fallback
}

export async function getReviews(tourId?: number): Promise<Review[]> {
  const response = await apiClient.get<Review[]>("/api/reviews", {
    params: tourId == null ? undefined : { tourId },
  })
  return response.data
}

export async function getMyReviews(): Promise<Review[]> {
  const response = await apiClient.get<Review[]>("/api/reviews/me")
  return response.data
}

export async function createReview(request: CreateReviewRequest): Promise<Review> {
  const response = await apiClient.post<Review>("/api/reviews", request)
  return response.data
}

export async function updateMyReview(
  reviewId: number,
  request: UpdateReviewRequest,
): Promise<Review> {
  const response = await apiClient.put<Review>(`/api/reviews/${reviewId}`, request)
  return response.data
}

export async function deleteMyReview(reviewId: number): Promise<void> {
  await apiClient.delete(`/api/reviews/${reviewId}`)
}
