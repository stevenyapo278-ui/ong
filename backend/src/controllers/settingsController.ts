import { Request, Response } from 'express';
import prisma from '../prisma';

export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await prisma.globalSettings.findUnique({
      where: { id: 'global' }
    });

    if (!settings) {
      settings = await prisma.globalSettings.create({
        data: { id: 'global' }
      });
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des paramètres', error });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { brochureUrl } = req.body;

    const settings = await prisma.globalSettings.upsert({
      where: { id: 'global' },
      update: { brochureUrl },
      create: { id: 'global', brochureUrl }
    });

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour des paramètres', error });
  }
};
