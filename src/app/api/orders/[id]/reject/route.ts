import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const RejectSchema = z.object({
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
        const result = RejectSchema.safeParse(body);

        const admin_notes = result.success ? result.data.admin_notes : undefined;

        const updatedOrder = await prisma.order.update({
            where: { id: params.id },
            data: {
                status: 'REJECTED',
                admin_notes
            }
        });

        return NextResponse.json(updatedOrder);

    } catch (error) {
        console.error('Rejection error:', error);
        return NextResponse.json({ error: 'Failed to reject order' }, { status: 500 });
    }
}
