import { prisma } from '@/lib/prisma';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

// Force dynamic rendering to ensure stats are up-to-date
export const dynamic = 'force-dynamic';

async function getAdminStats() {
    // 1. Total Pending Orders
    const totalPendingOrders = await prisma.order.count({
        where: { status: 'PENDING' }
    });

    // 2. Monthly Revenue
    const date = new Date();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

    // Aggregate sum of total_cost for non-cancelled orders this month
    // Note: If using SQLite, aggregate might behave differently, but for Postgres/MySQL it's standard.
    // Assuming total_cost is Decimal.
    const revenueResult = await prisma.order.aggregate({
        _sum: {
            total_cost: true
        },
        where: {
            created_at: {
                gte: firstDayOfMonth
            },
            status: {
                not: 'REJECTED' // Exclude rejected orders from revenue
            }
        }
    });

    const monthlyRevenue = revenueResult._sum.total_cost ? Number(revenueResult._sum.total_cost) : 0;

    // 3. Active Buyers
    // Buyers who have placed at least one order
    const activeBuyers = await prisma.user.count({
        where: {
            role: 'BUYER',
            orders: {
                some: {} // Has at least one order
            }
        }
    });

    return {
        totalPendingOrders,
        monthlyRevenue,
        activeBuyers
    };
}

export default async function AdminDashboard() {
    const stats = await getAdminStats();

    return (
        <AdminDashboardClient stats={stats} />
    );
}
