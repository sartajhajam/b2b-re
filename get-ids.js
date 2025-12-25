const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    const products = await prisma.product.findMany();

    console.log('--- TEST DATA ---');
    users.forEach(u => console.log(`${u.role}: ${u.id}`));
    products.forEach(p => console.log(`PRODUCT (${p.product_type}): ${p.id}`));
    console.log('-----------------');
}

main()
    .then(async () => { await prisma.$disconnect() })
    .catch(async (e) => { await prisma.$disconnect() });
