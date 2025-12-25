import { prisma } from './src/lib/prisma';
import { ProductType } from '@prisma/client';

async function main() {
    console.log('Testing Prisma Connection...');
    try {
        console.log('ProductTypes keys:', Object.keys(ProductType));
        console.log('ProductTypes values:', Object.values(ProductType));

        const count = await prisma.product.count();
        console.log('Product count:', count);

        // Try a query similar to the failing one
        const products = await prisma.product.findMany({
            where: { product_type: 'SHAWL' as ProductType },
            take: 1
        });
        console.log('Fetched sample product:', products);

    } catch (e) {
        console.error('Error in script:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
