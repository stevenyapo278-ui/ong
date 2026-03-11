import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from './types';

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const { active } = req.query;
    const where = active === 'true' ? { active: true } : {};
    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { order: 'asc' },
    });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des témoignages', error });
  }
};

export const createTestimonial = async (req: AuthRequest, res: Response) => {
  try {
    const { title, quote, detailTitle, detailContent, image, ctaText, ctaLink, active, order } = req.body;
    
    if (!title || !quote) {
      return res.status(400).json({ message: 'Le titre et la citation sont requis' });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        title,
        quote,
        detailTitle,
        detailContent,
        image,
        ctaText,
        ctaLink,
        active: active !== undefined ? active : true,
        order: order !== undefined ? parseInt(order) : 0,
      },
    });
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du témoignage', error });
  }
};

export const updateTestimonial = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    if (data.order !== undefined) data.order = parseInt(data.order);

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data,
    });
    res.json(testimonial);
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ message: 'Témoignage introuvable' });
    }
    res.status(500).json({ message: 'Erreur lors de la mise à jour du témoignage', error });
  }
};

export const deleteTestimonial = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.testimonial.delete({ where: { id } });
    res.json({ message: 'Témoignage supprimé' });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ message: 'Témoignage introuvable' });
    }
    res.status(500).json({ message: 'Erreur lors de la suppression du témoignage', error });
  }
};
