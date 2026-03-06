import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from './types';
import { inferPostTypeFromHtml } from '../utils/postType';

function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function generateUniqueSlug(title: string) {
  const base = slugify(title) || 'article';
  let slug = base;
  let counter = 2;

  // Loop until we find a free slug
  // In practice this stops very quickly.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing) return slug;
    slug = `${base}-${counter++}`;
  }
}

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      content,
      type,
      categories,
      excerpt,
      featuredImage,
      featured,
      seoTitle,
      seoDescription,
    } = req.body;

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }

    const authorId = dbUser.id;
    const inferredType = inferPostTypeFromHtml(content);
    const slug = await generateUniqueSlug(title);

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        featured: featured ?? false,
        type: type || inferredType,
        authorId,
        status: req.body.status && (dbUser.role === 'ADMIN' || dbUser.role === 'EDITOR') ? req.body.status : 'DRAFT',
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        categories: categories
          ? {
            connect: categories.map((catId: string) => ({ id: catId })),
          }
          : undefined,
      },
      include: {
        author: { select: { name: true, email: true } },
        categories: true,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    // Loguer l'erreur côté serveur pour faciliter le debug
    // eslint-disable-next-line no-console
    console.error('Erreur createPost:', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'article' });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  console.log('GET /api/posts - query:', req.query);
  try {
    const { status, type, categoryId, search, page = '1', pageSize = '9' } = req.query;

    const pageNumber = Math.max(parseInt(page as string, 10) || 1, 1);
    const sizeNumber = Math.max(parseInt(pageSize as string, 10) || 1, 1);

    const where: any = {
      type: (type as any) || undefined,
      categories: categoryId ? {
        some: { id: categoryId as string }
      } : undefined,
    };

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    // Par défaut, on ne renvoie que les articles publiés.
    // Si status=all, on ne filtre pas sur le statut.
    if (!status) {
      where.status = 'PUBLISHED';
    } else if (status !== 'all') {
      where.status = status as any;
    }

    const [items, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { name: true, email: true } },
          categories: true,
          media: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (pageNumber - 1) * sizeNumber,
        take: sizeNumber,
      }),
      prisma.post.count({ where }),
    ]);

    res.json({
      items,
      total,
      page: pageNumber,
      pageSize: sizeNumber,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des articles', error });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { name: true, email: true } },
        categories: true,
        media: true,
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'article', error });
  }
};

export const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { name: true, email: true } },
        categories: true,
        media: true,
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'article', error });
  }
};

export const submitPostForReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    // Only the author can submit their draft, unless the user is an admin or editor
    if (
      post.authorId !== req.user?.id &&
      req.user?.role === 'CONTRIBUTOR'
    ) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    if (post.status !== 'DRAFT') {
      return res.status(400).json({ message: 'Seuls les brouillons peuvent être soumis pour validation' });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { status: 'PENDING' },
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la soumission de l\'article pour validation', error });
  }
};

export const validatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reviewNote } = req.body; // Expect 'PUBLISHED' or 'DRAFT'

    if (status !== 'PUBLISHED' && status !== 'DRAFT') {
      return res.status(400).json({ message: 'Statut invalide. Utilisez PUBLISHED ou DRAFT.' });
    }

    const existing = await prisma.post.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    const data: any = {
      status,
      validatedById: req.user?.id,
      validatedAt: new Date(),
    };

    if (typeof reviewNote === 'string') {
      data.reviewNote = reviewNote;
    }

    if (status === 'PUBLISHED' && !existing.publishedAt) {
      data.publishedAt = new Date();
    }

    if (status === 'DRAFT') {
      data.publishedAt = null;
    }

    const post = await prisma.post.update({
      where: { id },
      data,
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la validation de l\'article', error });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user is author or admin
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    if (post.authorId !== req.user.id && req.user.role !== 'ADMIN' && req.user.role !== 'EDITOR') {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    await prisma.post.delete({ where: { id } });
    res.json({ message: 'Article supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'article', error });
  }
};

export const duplicatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        categories: true,
        media: true,
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    const newTitle = `${post.title} (Copie)`;
    const newSlug = await generateUniqueSlug(newTitle);

    const duplicatedPost = await prisma.post.create({
      data: {
        title: newTitle,
        slug: newSlug,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        featured: false,
        type: post.type,
        authorId: req.user?.id || post.authorId,
        status: 'DRAFT',
        seoTitle: post.seoTitle ? `${post.seoTitle} (Copie)` : null,
        seoDescription: post.seoDescription,
        categories: {
          connect: post.categories.map((cat: any) => ({ id: cat.id })),
        },
        // Duplicate media references
        media: {
          create: post.media.map((m: any) => ({
            url: m.url,
            type: m.type,
          })),
        },
      },
      include: {
        author: { select: { name: true, email: true } },
        categories: true,
        media: true,
      },
    });

    res.status(201).json(duplicatedPost);
  } catch (error) {
    console.error('Erreur duplicatePost:', error);
    res.status(500).json({ message: 'Erreur lors de la duplication de l\'article' });
  }
};
