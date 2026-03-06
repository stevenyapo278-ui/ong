import { Router, Request, Response } from 'express';
import { upload } from '../utils/upload';
import { protect } from '../middleware/auth';
import prisma from '../prisma';

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

export default router;
