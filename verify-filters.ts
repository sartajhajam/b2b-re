import { prisma } from './src/lib/prisma';
import { ProductType } from '@prisma/client';

async function main() {
    console.log('Verifying Filter Data...');

    // 1. Create a dummy product with sub-category
    const testProductCode = `MUFFLER-TEST-${Date.now()}`;
    const testProduct = await prisma.product.create({
        data: {
            name: 'Test Sub-Category Muffler',
            product_code: testProductCode,
            product_type: 'MUFFLER',
            sub_category: 'Super Silk Mufflers',
            materials: ['Merino Wool'],
            description: 'Test Description',
            price: 100,
            moq: 10,
            images: ['/test.jpg']
        }
    });
    console.log(`Created test product: ${testProduct.name} (${testProduct.id})`);

    // 2. Verify we can find it by sub-category
    const foundBySub = await prisma.product.findMany({
        where: {
            sub_category: 'Super Silk Mufflers'
        }
    });
    console.log(`Found ${foundBySub.length} products with sub_category 'Super Silk Mufflers'.`);
    foundBySub.forEach(p => console.log(`- ${p.name}`));

    // 3. Verify we can find it by material
    const foundByMaterial = await prisma.product.findMany({
        where: {
            materials: { has: 'Merino Wool' }
        }
    });
    console.log(`Found ${foundByMaterial.length} products with material 'Merino Wool'.`);

    // Cleanup
    await prisma.product.delete({ where: { id: testProduct.id } });
    console.log('Cleaned up test product.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
