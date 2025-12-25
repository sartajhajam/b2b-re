
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyAdminStats() {
    console.log('Verifying Admin Stats Queries...');

    try {
        // 1. Total Pending Orders
        const totalPendingOrders = await prisma.order.count({
            where: { status: 'PENDING' }
        });
        console.log(`Total Pending Orders: ${totalPendingOrders}`);

        // 2. Monthly Revenue
        const date = new Date();
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

        const revenueResult = await prisma.order.aggregate({
            _sum: {
                total_cost: true
            },
            where: {
                created_at: {
                    gte: firstDayOfMonth
                },
                status: {
                    not: 'REJECTED'
                }
            }
        });
        const monthlyRevenue = revenueResult._sum.total_cost ? Number(revenueResult._sum.total_cost) : 0;
        console.log(`Monthly Revenue: ${monthlyRevenue}`);

        // 3. Active Buyers
        const activeBuyers = await prisma.user.count({
            where: {
                role: 'BUYER',
                orders: {
                    some: {}
                }
            }
        });
        console.log(`Active Buyers: ${activeBuyers}`);

        console.log('Verification Successful!');
    } catch (error) {
        console.error('Verification Failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

verifyAdminStats();
