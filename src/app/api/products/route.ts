import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProductType } from '@prisma/client';

/**
 * Generate unique product code in format: {PRODUCT_TYPE}-{COUNTER}
 * Example: SHAWL-001, STOLE-002, etc.
 * Uses a loop to ensure uniqueness in case of race conditions.
 */
async function generateProductCode(productType: ProductType): Promise<string> {
    // Find the last product of the same type to guess the next counter
    const lastProduct = await prisma.product.findFirst({
        where: { product_type: productType },
        orderBy: { created_at: 'desc' },
        select: { product_code: true }
    });

    let counter = 1;

    if (lastProduct) {
        // Extract counter from product code (e.g., "SHAWL-001" -> 1)
        const match = lastProduct.product_code.match(/-(\d+)$/);
        if (match) {
            counter = parseInt(match[1]) + 1;
        }
    }

    // Try to find a unique code
    while (true) {
        const product_code = `${productType}-${counter.toString().padStart(3, '0')}`;

        // Check if this code actually exists
        const existing = await prisma.product.findUnique({
            where: { product_code }
        });

        if (!existing) {
            return product_code;
        }

        // Collision detected, increment and try again
        counter++;
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type'); // ProductType filter
        const material = searchParams.get('material'); // Material filter
        const sub_category = searchParams.get('sub_category'); // Sub-category filter

        // Pagination params
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12'); // Default 12 products per page
        const skip = (page - 1) * limit;

        const whereClause: any = {};

        if (type && Object.values(ProductType).includes(type as ProductType)) {
            whereClause.product_type = type;
        }

        if (sub_category) {
            whereClause.sub_category = sub_category;
        }

        const searchQuery = searchParams.get('search');
        if (searchQuery) {
            whereClause.OR = [
                { name: { contains: searchQuery, mode: 'insensitive' } },
                { description: { contains: searchQuery, mode: 'insensitive' } },
                { product_code: { contains: searchQuery, mode: 'insensitive' } }
            ];
        }

        if (material || searchParams.has('material')) {
            const materials = searchParams.getAll('material');
            if (materials.length > 0) {
                whereClause.materials = {
                    hasSome: materials
                };
            }
        }

        const ids = searchParams.get('ids');
        if (ids) {
            const idList = ids.split(',').filter(Boolean);
            if (idList.length > 0) {
                whereClause.id = {
                    in: idList
                };
            }
        }

        // Get total count for pagination metadata
        const total = await prisma.product.count({ where: whereClause });

        const products = await prisma.product.findMany({
            where: whereClause,
            orderBy: { created_at: 'desc' },
            skip,
            take: limit
        });

        // Return structured response with metadata
        return NextResponse.json({
            products,
            metadata: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch products',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, product_type, sub_category, materials, description, price, moq, images, width, length, wash_care } = body;

        // Validation
        if (!name || !product_type || !materials || !description || !price || !moq || !images) {
            return NextResponse.json(
                { error: 'All mandatory fields are required' },
                { status: 400 }
            );
        }

        // Validate product_type is valid enum value
        if (!Object.values(ProductType).includes(product_type as ProductType)) {
            return NextResponse.json(
                { error: 'Invalid product type' },
                { status: 400 }
            );
        }

        // Validate price is positive
        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum <= 0) {
            return NextResponse.json(
                { error: 'Price must be a positive number' },
                { status: 400 }
            );
        }

        // Validate width and length if provided
        let widthNum: number | null = null;
        if (width !== undefined && width !== null && width !== '') {
            widthNum = parseFloat(width);
            if (isNaN(widthNum) || widthNum <= 0) {
                return NextResponse.json(
                    { error: 'Width must be a valid positive number' },
                    { status: 400 }
                );
            }
        }

        let lengthNum: number | null = null;
        if (length !== undefined && length !== null && length !== '') {
            lengthNum = parseFloat(length);
            if (isNaN(lengthNum) || lengthNum <= 0) {
                return NextResponse.json(
                    { error: 'Length must be a valid positive number' },
                    { status: 400 }
                );
            }
        }

        // Auto-generate unique product code
        const product_code = await generateProductCode(product_type as ProductType);

        // Create product
        const product = await prisma.product.create({
            data: {
                product_code,
                name,
                product_type: product_type as ProductType,
                materials: Array.isArray(materials) ? materials : [materials],
                description,
                price: priceNum,
                moq: parseInt(moq),
                images: Array.isArray(images) ? images : [images],
                // New fields
                sub_category,
                width: widthNum,
                length: lengthNum,
                wash_care: Array.isArray(wash_care) ? wash_care : []
            } as any
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
}
