import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@schoolsaas.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email }
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        role: 'SUPER_ADMIN',
        profile: {
          create: {
            first_name: 'Super',
            last_name: 'Admin',
            phone: '1234567890'
          }
        }
      }
    });
    console.log('✅ Default Super Admin created!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } else {
    console.log('Super Admin already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
