import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from './types';

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des catégories', error });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ message: 'Le nom de la catégorie est requis' });
    }
    const category = await prisma.category.create({
      data: { name: name.trim() },
    });
    res.status(201).json(category);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(400).json({ message: 'Une catégorie avec ce nom existe déjà' });
    }
    res.status(500).json({ message: 'Erreur lors de la création de la catégorie', error });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ message: 'Le nom de la catégorie est requis' });
    }
    const category = await prisma.category.update({
      where: { id },
      data: { name: name.trim() },
    });
    res.json(category);
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ message: 'Catégorie introuvable' });
    }
    if (error?.code === 'P2002') {
      return res.status(400).json({ message: 'Une catégorie avec ce nom existe déjà' });
    }
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la catégorie', error });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Catégorie supprimée' });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ message: 'Catégorie introuvable' });
    }
    res.status(500).json({ message: 'Erreur lors de la suppression de la catégorie', error });
  }
};
