const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Clear existing
    try {
        await prisma.order.deleteMany();
        await prisma.product.deleteMany();
        await prisma.user.deleteMany();

        // Create Users
        const admin = await prisma.user.create({
            data: {
                name: 'Admin User',
                email: 'admin@ramba.com',
                password_hash: 'hashed_secret', // Mock hash
                role: 'ADMIN',
                company_name: 'Ramba HQ',
                country: 'India'
            }
        });

        const buyer = await prisma.user.create({
            data: {
                name: 'John Buyer',
                email: 'buyer@example.com',
                password_hash: 'hashed_secret',
                role: 'BUYER',
                company_name: 'Global Textiles Ltd',
                country: 'UK'
            }
        });

        console.log(`Users Created: Admin(${admin.id}), Buyer(${buyer.id})`);

        // Create Products
        const shawl = await prisma.product.create({
            data: {
                product_code: 'SH-001',
                name: 'Royal Kani Shawl',
                product_type: 'SHAWL',
                materials: ['Pashmina', 'Silk'],
                description: 'Handwoven masterpiece.',
                moq: 30,
                images: ['/shawl1.jpg']
            }
        });

        const stole = await prisma.product.create({
            data: {
                product_code: 'ST-002',
                name: 'Woolen Stole',
                product_type: 'STOLE',
                materials: ['Merino Wool'],
                description: 'Warm and soft.',
                moq: 30,
                images: ['/stole.jpg']
            }
        });

        console.log(`Products Created: ${shawl.id}, ${stole.id}`);
    } catch (e) {
        console.error(e);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
