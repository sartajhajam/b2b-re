import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProductType } from '@prisma/client';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id }
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, product_type, materials, description, price, moq, images, width, length, wash_care } = body;

        // Validation
        if (!name || !product_type || !materials || !description || !price || !moq || !images) {
            return NextResponse.json(
                { error: 'All compulsory fields are required' },
                { status: 400 }
            );
        }

        const priceNum = parseFloat(price);

        // Update product
        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                product_type: product_type as ProductType,
                materials: Array.isArray(materials) ? materials : [materials],
                description,
                price: priceNum,
                moq: parseInt(moq),
                images: Array.isArray(images) ? images : [images],
                // New fields - using 'as any' to avoid stale client issues
                width: width ? parseFloat(width) : null,
                length: length ? parseFloat(length) : null,
                wash_care: Array.isArray(wash_care) ? wash_care : []
            } as any
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.product.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}
