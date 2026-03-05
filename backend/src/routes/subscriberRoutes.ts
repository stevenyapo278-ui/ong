import { Router } from 'express';
import prisma from '../prisma';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    const subscriber = await prisma.subscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    res.status(201).json(subscriber);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l’inscription à la newsletter', error });
  }
});

router.get('/', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const format = (req.query.format as string) || 'json';
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (format === 'csv') {
      const header = 'email,date_inscription\n';
      const rows = subscribers
        .map((s) => `${s.email},${s.createdAt.toISOString()}`)
        .join('\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename=abonnes-newsletter.csv');
      return res.send('\uFEFF' + header + rows);
    }

    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des abonnés', error });
  }
});

export default router;

