import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from './types';
import { inferPostTypeFromHtml } from '../utils/postType';

export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, featuredImage, type, seoTitle, seoDescription, categories, status } = req.body;

    const existing = await prisma.post.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    if (
      existing.authorId !== req.user?.id &&
      req.user?.role !== 'ADMIN' &&
      req.user?.role !== 'EDITOR'
    ) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    const updateData: Parameters<typeof prisma.post.update>[0]['data'] = {
      title: title ?? existing.title,
      content: content ?? existing.content,
      excerpt: excerpt ?? existing.excerpt,
      featuredImage: featuredImage ?? existing.featuredImage,
      type: type ?? inferPostTypeFromHtml(content ?? existing.content),
      seoTitle: seoTitle ?? existing.seoTitle,
      seoDescription: seoDescription ?? existing.seoDescription,
    };

    if (status && (req.user?.role === 'ADMIN' || req.user?.role === 'EDITOR')) {
      updateData.status = status;
    }

    if (Array.isArray(categories)) {
      updateData.categories = { set: categories.map((catId: string) => ({ id: catId })) };
    }
    const post = await prisma.post.update({
      where: { id },
      data: updateData,
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'article', error });
  }
};

