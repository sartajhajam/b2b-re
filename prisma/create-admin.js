```javascript
const { PrismaClient } = require('@prisma/client');
// const bcrypt = require('bcryptjs'); // Not needed, using pre-computed hash

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@rambaexport.com';
    const name = 'Admin User';
    
    // Hash for 'Exporting@#2025' generated locally
    const hashedPassword = '$2b$10$BX3J3Ko8z8pHQI81CeHFUOk.f5bGZsCBIThKm5cXCMS9aiG4N0j92';

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
  ✅ Admin user created / verified!
Email: ${ email }
Password: Exporting @#2025
Role: ${ user.role }
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
