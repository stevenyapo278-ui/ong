import { Router, Request, Response } from 'express';
import { upload } from '../utils/upload';
import { protect } from '../middleware/auth';
import prisma from '../prisma';
import fs from 'fs';
import path from 'path';

const router = Router();

// GET all media for the Media Manager
router.get('/', protect, async (req: Request, res: Response) => {
  try {
    const { postId } = req.query;
    const media = await prisma.media.findMany({
      where: postId ? { postId: postId as string } : {},
      orderBy: { createdAt: 'desc' }
    });
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des médias', error });
  }
});

// POST upload new files
router.post('/', protect, (req: Request, res: Response, next: Function) => {
  upload.array('files', 5)(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const { postId } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'Aucun fichier téléchargé' });
    }

    const savedMedia = await Promise.all(
      files.map(file => {
        let subfolder = 'docs';
        if (file.mimetype.startsWith('video/')) subfolder = 'videos';
        else if (file.mimetype.startsWith('image/')) subfolder = 'images';

        return prisma.media.create({
          data: {
            url: `/uploads/${subfolder}/${file.filename}`,
            type: file.mimetype,
            postId: postId || null
          }
        });
      })
    );

    res.json(savedMedia);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du téléchargement des fichiers', error });
  }
});

// DELETE a media by ID
router.delete('/:id', protect, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // 1. Find the media in DB to get its URL
    const media = await prisma.media.findUnique({
      where: { id }
    });

    if (!media) {
      return res.status(404).json({ message: 'Média introuvable' });
    }

    // 2. Resolve the file path (URL is likely /uploads/...)
    // If url is /uploads/images/filename.jpg, we want the relative path to root: uploads/images/filename.jpg
    const relativePath = media.url.startsWith('/') ? media.url.substring(1) : media.url;
    const absolutePath = path.join(process.cwd(), relativePath);

    // 3. Delete from filesystem if it exists
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    // 4. Delete from DB
    await prisma.media.delete({
      where: { id }
    });

    res.json({ message: 'Média supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du média:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du média', error });
  }
});

export default router;
