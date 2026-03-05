import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { sendPasswordResetEmail } from '../utils/email';

export const register = async (req: Request, res: Response) => {
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
      },
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion', error });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Mot de passe actuel et nouveau mot de passe requis' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Le nouveau mot de passe doit contenir au moins 6 caractères' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        mustChangePassword: false,
      },
    });

    // Generate new token with updated info
    const token = jwt.sign(
      { id: updatedUser.id, role: updatedUser.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      mustChangePassword: false,
      token,
      message: 'Mot de passe modifié avec succès',
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du changement de mot de passe', error });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return res.json({ message: 'Si ce compte existe, un email de réinitialisation a été envoyé.' });
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpires },
    });
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(user.email, user.name, resetUrl);
    res.json({ message: 'Si ce compte existe, un email de réinitialisation a été envoyé.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la demande de réinitialisation', error });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token et nouveau mot de passe requis' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
    }
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: { gt: new Date() },
      },
    });
    if (!user) {
      return res.status(400).json({ message: 'Lien invalide ou expiré. Veuillez refaire une demande.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
        mustChangePassword: false,
      },
    });
    res.json({ message: 'Mot de passe mis à jour. Vous pouvez vous connecter.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe', error });
  }
};
