import { apiClient } from "@/services/apiClient";
import { PaymentResponse } from "../types";

export const paymentService = {
    // Create payment and get QR code
    createPayment: async (bookingId: string): Promise<PaymentResponse> => {
        const response = await apiClient.post(`/api/payments`, { bookingId });
        return response.data;
    },

    // Check current payment status (for polling)
    getPaymentStatus: async (paymentId: number): Promise<{ status: string }> => {
        const response = await apiClient.get(`/api/payments/${paymentId}/status`);
        return response.data;
    }
};