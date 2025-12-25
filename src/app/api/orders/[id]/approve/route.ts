import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const ApproveSchema = z.object({
    total_cost: z.number().positive(),
    payment_terms: z.string().min(1),
    payment_mode: z.string().min(1),
    delivery_mode: z.string().min(1),
    delivery_timeline: z.string().min(1),
    admin_notes: z.string().optional(),
});

export async function POST(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const userId = request.headers.get('x-user-id');
        const user = await prisma.user.findUnique({ where: { id: userId || '' } });

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
        }

        const body = await request.json();
        const result = ApproveSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
        }

        const { total_cost, payment_terms, payment_mode, delivery_mode, delivery_timeline, admin_notes } = result.data;

        const updatedOrder = await prisma.order.update({
            where: { id: params.id },
            data: {
                status: 'APPROVED',
                total_cost,
                payment_terms,
                payment_mode,
                delivery_mode,
                delivery_timeline,
                admin_notes
            }
        });

        return NextResponse.json(updatedOrder);

    } catch (error) {
        console.error('Approval error:', error);
        return NextResponse.json({ error: 'Failed to approve order' }, { status: 500 });
    }
}
