export type BookingStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';

export interface PaymentSummaryDto {
  paymentId?: number;
  method?: string;
  status?: string;
  amount?: number;
  paymentDate?: string;
}

export interface BookingTravelerDto {
  fullName: string;
  gender: string;
  dateOfBirth: string; // YYYY-MM-DD
  phone?: string;
  travelerType: string;
}

export interface AdminBookingResponse {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  
  departureId: number;
  tourId: number;
  tourName: string;
  departureDate: string; // YYYY-MM-DD
  
  bookingDate: string; // YYYY-MM-DDTHH:mm:ss
  numberOfPeople: number;
  totalPrice: number;
  
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  
  status: BookingStatus;
  
  travelers: BookingTravelerDto[];
  payment: PaymentSummaryDto;
}

export interface AdminBookingFilterParams {
  bookingId?: number;
  status?: BookingStatus;
  tourId?: number;
  departureId?: number;
  departureDate?: string; // YYYY-MM-DD
  searchKeyword?: string;
  page?: number;
  size?: number;
  sort?: string;
}

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

export interface AdminBookingStatsResponse {
  total: number;
  confirmed: number;
  pending: number;
  failed: number;
}
