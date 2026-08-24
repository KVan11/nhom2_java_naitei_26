export interface DailyRevenue {
    date: string;
    amount: number;
}

export interface RevenueStats {
    totalRevenue: number;
    chartData: DailyRevenue[];
}