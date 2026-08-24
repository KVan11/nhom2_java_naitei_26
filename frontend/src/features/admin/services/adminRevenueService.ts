import { apiClient } from "@/services/apiClient";
import { RevenueStats } from "../types/revenue";

export const adminRevenueService = {
    // Fetch total revenue and chart data
    getStats: async (): Promise<RevenueStats> => {
        const response = await apiClient.get('/admin/revenue/stats');
        return response.data;
    }
};