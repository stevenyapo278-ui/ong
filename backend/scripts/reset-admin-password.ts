/**
 * Réinitialise le mot de passe du compte admin (admin@ong.org).
 * Crée l'admin s'il n'existe pas.
 *
 * Usage (depuis le dossier backend) :
 *   npx ts-node scripts/reset-admin-password.ts
 *   npx ts-node scripts/reset-admin-password.ts MonNouveauMotDePasse
 *   ADMIN_PASSWORD=MonNouveauMotDePasse npx ts-node scripts/reset-admin-password.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@ong.org';
const DEFAULT_PASSWORD = 'admin123';

async function main() {
  const password = process.env.ADMIN_PASSWORD ?? process.argv[2] ?? DEFAULT_PASSWORD;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Administrateur ONG',
      mustChangePassword: false,
    },
    create: {
      email: ADMIN_EMAIL,
      name: 'Administrateur ONG',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✓ Compte admin mis à jour / créé.');
  console.log('  Email:', admin.email);
  console.log('  Mot de passe:', password === DEFAULT_PASSWORD ? DEFAULT_PASSWORD : '(celui que vous avez fourni)');
}

main()
  .catch((e) => {
    console.error('Erreur:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
