import { prisma } from './src/lib/prisma';
import { ProductType } from '@prisma/client';

async function main() {
    console.log('Testing Prisma Connection...');
    try {
        const type = 'SHAWL';
        console.log(`Fetching products for type: ${type}`);

        // Mimic the API logic
        const whereClause: any = {};
        if (Object.values(ProductType).includes(type as ProductType)) {
            whereClause.product_type = type;
        } else {
            console.log('Invalid type provided according to Enum check');
        }

        const products = await prisma.product.findMany({
            where: whereClause,
            orderBy: { created_at: 'desc' }
        });

        console.log(`Success! Found ${products.length} products.`);
        console.log(JSON.stringify(products, null, 2));

    } catch (error) {
        console.error('Error executing query:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
