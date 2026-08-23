import { apiClient } from './apiClient'

export type Comment = {
  id: number
  reviewId: number
  userId: number
  userName: string | null
  userAvatar: string | null
  parentCommentId: number | null
  content: string
  createdAt: string
  updatedAt: string
  replies: Comment[]
}

export type CreateCommentRequest = {
  content: string
  parentCommentId?: number | null
}

type ApiError = {
  response?: {
    data?: {
      message?: string
    }
  }
}

function getErrorMessage(error: unknown, fallback: string): string {
  const apiMessage = (error as ApiError)?.response?.data?.message
  return apiMessage || (error instanceof Error ? error.message : fallback)
}

export async function getComments(reviewId: number): Promise<Comment[]> {
  try {
    const response = await apiClient.get<Comment[]>(`/api/reviews/${reviewId}/comments`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to load comments'))
  }
}

export async function createComment(
  reviewId: number,
  request: CreateCommentRequest,
): Promise<Comment> {
  try {
    const response = await apiClient.post<Comment>(`/api/reviews/${reviewId}/comments`, request)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to submit comment'))
  }
}
