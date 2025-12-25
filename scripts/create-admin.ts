
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@rambaexport.com';
    const password = 'Exporting@#2025';

    console.log(`Creating/Updating admin user: ${email}`);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password_hash: hashedPassword,
            role: 'ADMIN',
        },
        create: {
            email,
            name: 'System Admin',
            password_hash: hashedPassword,
            role: 'ADMIN',
            company_name: 'Ramba Exports',
            country: 'India'
        }
    });

    console.log('Admin user created successfully:', user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
