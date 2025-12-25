import { prisma } from './src/lib/prisma';

async function main() {
    const buyer = await prisma.user.findFirst({
        where: { role: 'BUYER' }
    });
    if (buyer) {
        console.log(`BUYER_ID=${buyer.id}`);
    } else {
        console.log('No buyer found');
    }
    await prisma.$disconnect();
}
main();
