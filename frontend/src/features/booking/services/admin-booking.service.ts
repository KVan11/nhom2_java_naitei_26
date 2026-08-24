import { apiClient } from '@/services/apiClient';
import type { 
  AdminBookingResponse, 
  AdminBookingFilterParams, 
  PageResponse,
  BookingStatus,
  AdminBookingStatsResponse
} from '../types/admin-booking.types';

export const getAdminBookings = async (
  params?: AdminBookingFilterParams
): Promise<PageResponse<AdminBookingResponse>> => {
  const response = await apiClient.get<PageResponse<AdminBookingResponse>>('/api/admin/bookings', {
    params,
  });
  return response.data;
};

export const getAdminBookingDetails = async (id: number): Promise<AdminBookingResponse> => {
  const response = await apiClient.get<AdminBookingResponse>(`/api/admin/bookings/${id}`);
  return response.data;
};

export const updateAdminBookingStatus = async (
  id: number,
  status: BookingStatus
): Promise<AdminBookingResponse> => {
  const response = await apiClient.patch<AdminBookingResponse>(`/api/admin/bookings/${id}/status`, {
    status,
  });
  return response.data;
};

export const getAdminBookingStats = async (): Promise<AdminBookingStatsResponse> => {
  const response = await apiClient.get<AdminBookingStatsResponse>('/api/admin/bookings/stats');
  return response.data;
};

export const adminBookingService = {
  getAdminBookings,
  getAdminBookingDetails,
  updateAdminBookingStatus,
  getAdminBookingStats,
};
