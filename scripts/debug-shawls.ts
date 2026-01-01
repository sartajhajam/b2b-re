import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Fetching SHAWL products...');
    const products = await prisma.product.findMany({
        where: { product_type: 'SHAWL' },
        select: { id: true, product_code: true, name: true, created_at: true },
        orderBy: { created_at: 'desc' },
    });
    console.log(`Found ${products.length} SHAWL products:`);
    products.forEach(p => console.log(`${p.product_code} (${p.created_at.toISOString()})`));

    if (products.length === 0) {
        console.log("No SHAWL products found. Next should be SHAWL-001.");
        return;
    }

    // Simulation of generateProductCode logic
    const lastProduct = products[0]; // ordered by desc
    let counter = 1;

    const match = lastProduct.product_code.match(/-(\d+)$/);
    if (match) {
        counter = parseInt(match[1]) + 1;
    } else {
        console.log(`Last product code ${lastProduct.product_code} does not match regex /-(\d+)$/`);
    }

    const nextCode = `SHAWL-${counter.toString().padStart(3, '0')}`;
    console.log(`Next generated code would be: ${nextCode}`);

    // Check collision
    const exists = await prisma.product.findUnique({ where: { product_code: nextCode } });
    if (exists) {
        console.error(`COLLISION DETECTED! ${nextCode} already exists! This IS the cause of the 500 error.`);
    } else {
        console.log(`Code ${nextCode} is available.`);

        // Check if maybe there is a higher counter somewhere else?
        // Check all products
        let maxCounter = 0;
        products.forEach(p => {
            const m = p.product_code.match(/-(\d+)$/);
            if (m) {
                const c = parseInt(m[1]);
                if (c > maxCounter) maxCounter = c;
            }
        });
        console.log(`Max counter found in DB: ${maxCounter}`);
        if (counter <= maxCounter) {
            console.log(`WARNING: Generated counter ${counter} <= maxCounter ${maxCounter}. Potential collision if the max one was not the latest created.`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
