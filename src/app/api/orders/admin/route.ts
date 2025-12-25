import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function getAdminUser(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload || !payload.userId) return null;

    if (payload.role !== 'ADMIN') return null;

    const user = await prisma.user.findUnique({
        where: { id: payload.userId }
    });
    return user?.role === 'ADMIN' ? user : null;
}

export async function GET(request: Request) {
    try {
        const admin = await getAdminUser(request);

        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
        }

        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                product_code: true,
                                product_type: true,
                                images: true
                            }
                        }
                    }
                },
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        company_name: true,
                        email: true,
                        country: true
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
