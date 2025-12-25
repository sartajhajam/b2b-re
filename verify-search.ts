import { prisma } from './src/lib/prisma';
import { ProductType } from '@prisma/client';

async function main() {
    console.log('Verifying Search Logic...');

    // 1. Create test products
    const p1 = await prisma.product.create({
        data: {
            name: 'Searchable Silk Shawl',
            product_code: 'SEARCH-001',
            product_type: 'SHAWL',
            materials: ['Silk'],
            description: 'A unique searchable description term: Quasar',
            price: 100,
            moq: 1,
            images: ['/test.jpg']
        }
    });

    const p2 = await prisma.product.create({
        data: {
            name: 'Hidden Product',
            product_code: 'SEARCH-002',
            product_type: 'SHAWL',
            materials: ['Wool'],
            description: 'Nothing special',
            price: 100,
            moq: 1,
            images: ['/test.jpg']
        }
    });

    try {
        // 2. Simulate Search by Name
        const resName = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: 'Searchable', mode: 'insensitive' } },
                    { description: { contains: 'Searchable', mode: 'insensitive' } },
                    { product_code: { contains: 'Searchable', mode: 'insensitive' } }
                ]
            }
        });
        console.log(`Search 'Searchable': Found ${resName.length} (Expected 1)`);
        if (resName.length > 0) console.log(`- ${resName[0].name}`);

        // 3. Simulate Search by Description
        const resDesc = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: 'Quasar', mode: 'insensitive' } },
                    { description: { contains: 'Quasar', mode: 'insensitive' } },
                    { product_code: { contains: 'Quasar', mode: 'insensitive' } }
                ]
            }
        });
        console.log(`Search 'Quasar': Found ${resDesc.length} (Expected 1)`);

        // 4. Simulate Search by SKU
        const resSku = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: 'SEARCH-002', mode: 'insensitive' } },
                    { description: { contains: 'SEARCH-002', mode: 'insensitive' } },
                    { product_code: { contains: 'SEARCH-002', mode: 'insensitive' } }
                ]
            }
        });
        console.log(`Search 'SEARCH-002': Found ${resSku.length} (Expected 1)`);

    } finally {
        // Cleanup
        await prisma.product.deleteMany({
            where: { product_code: { startsWith: 'SEARCH-' } }
        });
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
