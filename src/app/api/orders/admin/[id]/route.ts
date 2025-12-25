import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';
import { z } from 'zod';
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

const UpdateOrderSchema = z.object({
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
    total_cost: z.number().positive().optional(),
    payment_terms: z.string().optional(),
    payment_mode: z.string().optional(),
    delivery_mode: z.string().optional(),
    delivery_timeline: z.string().optional(),
    admin_notes: z.string().optional(),
    admin_contact_email: z.string().email().optional().or(z.literal('')),
    admin_contact_phone: z.string().optional(),
});

// GET /api/orders/admin/[id] - Fetch single order
export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const admin = await getAdminUser(request);

        if (!admin) {
            return NextResponse.json(
                { error: 'Unauthorized: Admin access required' },
                { status: 403 }
            );
        }

        const order = await prisma.order.findUnique({
            where: { id: params.id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        company_name: true,
                        country: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { error: 'Failed to fetch order' },
            { status: 500 }
        );
    }
}

// PUT /api/orders/admin/[id] - Update order status and details
export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const admin = await getAdminUser(request);

        if (!admin) {
            return NextResponse.json(
                { error: 'Unauthorized: Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const result = UpdateOrderSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.flatten() },
                { status: 400 }
            );
        }

        const { status, total_cost, payment_terms, payment_mode, delivery_mode, delivery_timeline, admin_notes, admin_contact_email, admin_contact_phone } = result.data;

        // Check if order exists
        const existingOrder = await prisma.order.findUnique({
            where: { id: params.id }
        });

        if (!existingOrder) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Validate that required fields are provided when approving
        if (status === 'APPROVED') {
            if (!total_cost || !payment_terms || !payment_mode || !delivery_mode || !delivery_timeline) {
                return NextResponse.json(
                    { error: 'All pricing and delivery details are required for approval' },
                    { status: 400 }
                );
            }
        }

        // Build update data
        const updateData: any = {};
        if (status) updateData.status = status as OrderStatus;
        if (total_cost !== undefined) updateData.total_cost = total_cost;
        if (payment_terms) updateData.payment_terms = payment_terms;
        if (payment_mode) updateData.payment_mode = payment_mode;
        if (delivery_mode) updateData.delivery_mode = delivery_mode;
        if (delivery_timeline) updateData.delivery_timeline = delivery_timeline;
        if (admin_notes !== undefined) updateData.admin_notes = admin_notes;
        if (admin_contact_email !== undefined) updateData.admin_contact_email = admin_contact_email;
        if (admin_contact_phone !== undefined) updateData.admin_contact_phone = admin_contact_phone;

        const updatedOrder = await prisma.order.update({
            where: { id: params.id },
            data: updateData,
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        company_name: true,
                        country: true
                    }
                }
            }
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
        );
    }
}

// DELETE /api/orders/admin/[id] - Delete order
export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const admin = await getAdminUser(request);

        if (!admin) {
            return NextResponse.json(
                { error: 'Unauthorized: Admin access required' },
                { status: 403 }
            );
        }

        // Check if order exists
        const existingOrder = await prisma.order.findUnique({
            where: { id: params.id },
            include: { items: true } // Need to handle cascade delete if not auto by DB
        });

        if (!existingOrder) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Delete order (Cascade should handle order items if set in schema, 
        // referencing OrderItem definition: onDelete: Cascade is set on order relation)
        await prisma.order.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        return NextResponse.json(
            { error: 'Failed to delete order' },
            { status: 500 }
        );
    }
}
