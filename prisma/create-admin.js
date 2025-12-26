const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@rambaexport.com';
    const password = 'Exporting@#2025';
    const name = 'Admin User';

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name,
            password_hash: hashedPassword,
            role: 'ADMIN',
            company_name: 'Ramba HQ',
            country: 'India',
        },
    });

    console.log(`
  ✅ Admin user created/verified!
  Email: ${email}
  Password: ${password}
  Role: ${user.role}
  `);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
