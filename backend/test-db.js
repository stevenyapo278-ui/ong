const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('Successfully connected to the database!');
    const users = await prisma.user.count();
    console.log(`Found ${users} users in the database.`);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

test();
