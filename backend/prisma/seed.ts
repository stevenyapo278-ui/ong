import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ong.org' },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Administrateur ONG',
    },
    create: {
      email: 'admin@ong.org',
      name: 'Administrateur ONG',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin.email);

  // Create Categories
  const categories = [
    { name: 'Éducation' },
    { name: 'Santé' },
    { name: 'Environnement' },
    { name: 'Aide Humanitaire' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  console.log('Categories created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
