import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@rambaexports.com';
    const password = 'Exporting@#2025';
    const name = 'Admin User';
    const company_name = 'Ramba Exports';
    const country = 'India';

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password_hash: hashedPassword,
            role: Role.ADMIN,
        },
        create: {
            email,
            password_hash: hashedPassword,
            name,
            role: Role.ADMIN,
            company_name,
            country,
        },
    });

    console.log(`Admin user created/updated: ${user.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
