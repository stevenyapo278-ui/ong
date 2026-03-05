import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prisma';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'CONTRIBUTOR',
        mustChangePassword: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // On ne peut pas se supprimer soi-même
    if (id === (req as any).user.id) {
        return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte admin' });
    }

    await prisma.user.delete({ where: { id } });
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error });
  }
};
