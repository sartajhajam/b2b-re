import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function getBuyerUser(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload || !payload.userId) return null;

    // Optional: check if role is BUYER, though verifyToken ensures it's a valid user. 
    // The route handler checks for unauthorized access if this returns null.

    const user = await prisma.user.findUnique({
        where: { id: payload.userId }
    });
    return user?.role === 'BUYER' ? user : null;
}

// GET /api/orders/buyer - Fetch all orders for authenticated buyer
export async function GET(request: Request) {
    try {
        const buyer = await getBuyerUser(request);

        if (!buyer) {
            return NextResponse.json(
                { error: 'Unauthorized: Buyer access required' },
                { status: 403 }
            );
        }

        const orders = await prisma.order.findMany({
            where: { buyer_id: buyer.id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                product_code: true,
                                product_type: true,
                                images: true,
                                price: true
                            }
                        }
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching buyer orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
