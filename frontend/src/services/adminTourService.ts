import { apiClient } from './apiClient';
import type { BackendTourResponse } from '@/features/tour/services/tour.service';

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface TourImageRequest {
  imageUrl: string;
}

export interface TourDepartureRequest {
  id?: number;
  departureDate: string; // YYYY-MM-DD
  returnDate: string;    // YYYY-MM-DD
  price: number;
  totalSlot: number;
  availableSlot: number;
  status: 'UPCOMING' | 'FULL' | 'CANCELLED' | 'COMPLETED';
}

export interface TourRequest {
  name: string;
  description?: string;
  basePrice: number;
  departure?: string;
  destination?: string;
  duration?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'INACTIVE' | 'ARCHIVED';
  startDate: string; // YYYY-MM-THH:mm:ss
  endDate: string;   // YYYY-MM-THH:mm:ss
  categoryId: number;
  images?: TourImageRequest[];
  departures?: TourDepartureRequest[];
}

export interface FetchAdminToursParams {
  keyword?: string;
  categoryId?: number;
  page?: number;
  size?: number;
  sort?: string;
}

export async function getAdminTours(params?: FetchAdminToursParams): Promise<PageResponse<BackendTourResponse>> {
  const queryParams: Record<string, any> = {};
  if (params?.keyword) queryParams.keyword = params.keyword;
  if (params?.categoryId) queryParams.categoryId = params.categoryId;
  if (params?.page !== undefined) queryParams.page = params.page;
  if (params?.size !== undefined) queryParams.size = params.size;
  if (params?.sort) queryParams.sort = params.sort;

  const response = await apiClient.get<PageResponse<BackendTourResponse>>('/api/admin/tours', {
    params: queryParams,
  });
  return response.data;
}

export async function getAdminTourById(id: number): Promise<BackendTourResponse> {
  const response = await apiClient.get<BackendTourResponse>(`/api/admin/tours/${id}`);
  return response.data;
}

export async function createAdminTour(request: TourRequest): Promise<BackendTourResponse> {
  const response = await apiClient.post<BackendTourResponse>('/api/admin/tours', request);
  return response.data;
}

export async function updateAdminTour(id: number, request: TourRequest): Promise<BackendTourResponse> {
  const response = await apiClient.put<BackendTourResponse>(`/api/admin/tours/${id}`, request);
  return response.data;
}

export async function deleteAdminTour(id: number): Promise<void> {
  await apiClient.delete(`/api/admin/tours/${id}`);
}

export const adminTourService = {
  getAdminTours,
  getAdminTourById,
  createAdminTour,
  updateAdminTour,
  deleteAdminTour,
};
