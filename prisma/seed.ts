import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Clear existing
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

    console.log({ adminId: admin.id, buyerId: buyer.id });

    // Create Products
    const shawl = await prisma.product.create({
        data: {
            product_code: 'SH-001',
            name: 'Royal Kani Shawl',
            product_type: 'SHAWL',
            materials: ['Pashmina', 'Silk'],
            description: 'Handwoven masterpiece.',
            price: 150.00,
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
            price: 80.50,
            moq: 30,
            images: ['/stole.jpg']
        }
    });

    const kimono = await prisma.product.create({
        data: {
            product_code: 'KM-003',
            name: 'Silk Kimono',
            product_type: 'KIMONO',
            materials: ['Silk'],
            description: 'Elegant traditional wear.',
            price: 250.00,
            moq: 10,
            images: ['/kimono.jpg']
        }
    });

    const cape = await prisma.product.create({
        data: {
            product_code: 'CP-004',
            name: 'Woolen Cape',
            product_type: 'CAPE',
            materials: ['Wool'],
            description: 'Stylish winter cape.',
            price: 120.00,
            moq: 20,
            images: ['/cape.jpg']
        }
    });

    console.log({ shawlId: shawl.id, stoleId: stole.id, kimonoId: kimono.id, capeId: cape.id });
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
