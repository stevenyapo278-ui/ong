import bcrypt from 'bcryptjs';
import prisma from './src/prisma';

async function test() {
  console.log('Testing dependencies...');
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password', salt);
    console.log('Bcrypt OK:', hash.substring(0, 10));
    
    const count = await prisma.user.count();
    console.log('Prisma OK, user count:', count);
  } catch (err) {
    console.error('Error in test:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
