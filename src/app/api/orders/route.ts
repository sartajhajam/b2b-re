import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// Auth Helper
async function getAuthenticatedUser(request: Request) {
    // try cookie first
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    let userId: string | undefined;

    if (token) {
        const payload = verifyToken(token.value);
        if (payload) userId = payload.userId;
    }

    // Fallback to header for testing (optional, maybe remove for production security)
    if (!userId) {
        userId = request.headers.get('x-user-id') || undefined;
    }

    if (!userId) return null;

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    return user;
}

const OrderSchema = z.object({
    product_id: z.string(),
    quantity: z.number().min(30, "Minimum order quantity is 30"),
});

export async function POST(request: Request) {
    try {
        const user = await getAuthenticatedUser(request);

        if (!user || user.role !== 'BUYER') {
            return NextResponse.json({ error: 'Unauthorized: Buyer access required' }, { status: 401 });
        }

        const body = await request.json();

        // Handle explicit "items" array for bulk orders
        const items = Array.isArray(body.items) ? body.items : [body];

        if (items.length === 0) {
            return NextResponse.json({ error: 'No items provided' }, { status: 400 });
        }

        // Validate all items against database and calculate total
        const validItemData = [];
        let calculatedTotal = 0;

        for (const item of items) {
            // Basic format check
            if (!item.product_id || !item.quantity) {
                return NextResponse.json({ error: `Invalid item format: ${JSON.stringify(item)}` }, { status: 400 });
            }

            // Fetch product to check MOQ and Price
            const product = await prisma.product.findUnique({
                where: { id: item.product_id }
            });

            if (!product) {
                return NextResponse.json({ error: `Product not found: ${item.product_id}` }, { status: 404 });
            }

            if (item.quantity < product.moq) {
                return NextResponse.json({
                    error: `Quantity ${item.quantity} is below MOQ of ${product.moq} for product ${product.name}`
                }, { status: 400 });
            }

            const lineCost = Number(product.price) * item.quantity;
            calculatedTotal += lineCost;

            validItemData.push({
                product_id: item.product_id,
                quantity: item.quantity
            });
        }

        // Generate friendly order ID: NAME-RANDOM
        const namePart = user.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4) || 'USER';
        const randomPart = Math.floor(10000 + Math.random() * 90000); // 5 digit random
        const orderNumber = `${namePart}-${randomPart}`;

        // Create Single Order with Multiple Items
        const newOrder = await prisma.order.create({
            data: {
                buyer_id: user.id,
                status: 'PENDING',
                order_number: orderNumber,
                total_cost: calculatedTotal,
                items: {
                    createMany: {
                        data: validItemData
                    }
                }
            },
            include: {
                items: true
            }
        });

        return NextResponse.json({
            message: `Successfully created Order #${orderNumber}`,
            order: newOrder
        }, { status: 201 });

    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
