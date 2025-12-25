import Link from 'next/link';
import { OrderCard } from '@/components/buyer/OrderCard';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function getBuyerOrders() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) return null;

    const payload = verifyToken(token.value);
    if (!payload || !payload.userId) return null;

    // Fetch orders with nested items and products
    const orders = await prisma.order.findMany({
        where: { buyer_id: payload.userId },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            name: true,
                            images: true,
                            product_code: true,
                            price: true
                        }
                    }
                }
            }
        },
        orderBy: { created_at: 'desc' }
    });

    // Serialize Decimal types to number for client component
    const serializedOrders = orders.map(order => ({
        ...order,
        total_cost: order.total_cost ? Number(order.total_cost) : null,
        items: order.items.map(item => ({
            ...item,
            product: {
                ...item.product,
                price: item.product.price ? Number(item.product.price) : null
            }
        }))
    }));

    return serializedOrders;
}

export default async function BuyerDashboard() {
    const orders = await getBuyerOrders();

    if (!orders) {
        redirect('/auth/login');
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-grow bg-gray-50 py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Buyer Dashboard</h1>
                        <div className="flex items-center gap-3 space-x-2 mt-4 md:mt-0">
                            <Link href="/catalog">
                                <Button>Browse Catalog</Button>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-8 space-y-6">
                        <h2 className="text-lg font-medium text-gray-900">Your Orders</h2>

                        {orders.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded-lg shadow">
                                <p className="text-gray-500 mb-4">No orders found.</p>
                                <Link href="/catalog">
                                    <Button variant="outline">Start Browsing</Button>
                                </Link>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))
                        )}
                    </div>
                </div>
            </main >
            <Footer />
        </div >
    );
}
