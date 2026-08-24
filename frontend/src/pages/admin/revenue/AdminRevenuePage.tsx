import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminRevenueService } from "@/features/admin/services/adminRevenueService";
import { RevenueStats } from "@/features/admin/types/revenue";
import {OverviewChart} from "@/pages/admin/components/OverviewChart"; // Using group's chart component
import { Skeleton } from "@/components/ui/skeleton";

const AdminRevenuePage = () => {
    const [stats, setStats] = useState<RevenueStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminRevenueService.getStats()
            .then(setStats)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 space-y-4"><Skeleton className="h-40 w-full" /><Skeleton className="h-80 w-full" /></div>;

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Revenue Management</h1>

            {/* Summary Card */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-brand shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Total Revenue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-brand">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats?.totalRevenue || 0)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Chart */}
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Daily Revenue (Last 14 Days)</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    {/* Mapping stats.chartData to the format OverviewChart expects */}
                    <OverviewChart data={stats?.chartData || []} />
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminRevenuePage;