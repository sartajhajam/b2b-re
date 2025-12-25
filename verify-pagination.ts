import { prisma } from './src/lib/prisma';
import { ProductType } from '@prisma/client';

async function main() {
    console.log('Verifying Pagination Logic...');

    // 1. Create many products to test pagination (e.g. 15 Shawls)
    console.log('Creating test products...');
    const productsToCreate = [];
    for (let i = 1; i <= 15; i++) {
        productsToCreate.push({
            name: `Pagination Test Shawl ${i}`,
            product_code: `PAG-TEST-${i}-${Date.now()}`,
            product_type: 'SHAWL' as ProductType,
            materials: ['Wool'],
            description: 'Test',
            price: 100,
            moq: 1,
            images: ['/test.jpg']
        });
    }

    // Batch create might cause issues with unique constraints if strict, so simple loop or createMany
    // Prisma createMany is supported
    await prisma.product.createMany({
        data: productsToCreate
    });

    try {
        // 2. Simulate API Page 1 (Limit 12)
        const limit = 12;
        const page1 = await prisma.product.findMany({
            where: { product_type: 'SHAWL', product_code: { startsWith: 'PAG-TEST-' } },
            orderBy: { created_at: 'desc' }, // Latest first
            take: limit,
            skip: 0
        });

        console.log(`Page 1 Products: ${page1.length} (Expected 12)`);
        console.log(`First on Page 1: ${page1[0].name}`);

        // 3. Simulate API Page 2
        const page2 = await prisma.product.findMany({
            where: { product_type: 'SHAWL', product_code: { startsWith: 'PAG-TEST-' } },
            orderBy: { created_at: 'desc' },
            take: limit,
            skip: 12 // (2-1) * 12
        });

        console.log(`Page 2 Products: ${page2.length} (Expected 3)`);
        if (page2.length > 0) {
            console.log(`First on Page 2: ${page2[0]?.name}`);
        }

    } finally {
        // Cleanup
        console.log('Cleaning up...');
        await prisma.product.deleteMany({
            where: { product_code: { startsWith: 'PAG-TEST-' } }
        });
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
