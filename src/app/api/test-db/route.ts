import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProductType } from '@prisma/client';

export async function GET() {
    try {
        const debugInfo = {
            productTypeParams: Object.keys(ProductType || {}),
            productTypeValues: Object.values(ProductType || {}),
            env: process.env.NODE_ENV,
        };

        // Try a simple count query
        const count = await prisma.product.count();

        return NextResponse.json({
            status: 'ok',
            count,
            debugInfo
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
