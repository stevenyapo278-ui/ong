import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// Liste des commentaires approuvés pour un article
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { postId, approved: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commentaires', error });
  }
});

// Création d'un commentaire (public)
router.post('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { authorName, authorEmail, content } = req.body;
    if (!authorName || !authorEmail || !content) {
      return res.status(400).json({ message: 'Nom, email et contenu sont requis.' });
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        authorName,
        authorEmail,
        content,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du commentaire', error });
  }
});

export default router;

