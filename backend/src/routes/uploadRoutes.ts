import { Router, Request, Response } from 'express';
import { upload } from '../utils/upload';
import { protect } from '../middleware/auth';
import prisma from '../prisma';

const router = Router();

router.post('/', protect, upload.array('files', 5), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const { postId } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'Aucun fichier téléchargé' });
    }

    const mediaData = files.map(file => ({
      url: `/uploads/${file.mimetype.startsWith('video/') ? 'videos' : 'images'}/${file.filename}`,
      type: file.mimetype,
      postId: postId // Can be null if uploading before post creation or handled differently
    }));

    // If a postId is provided, we save to DB immediately
    if (postId) {
      const savedMedia = await Promise.all(
        mediaData.map(data => prisma.media.create({ data }))
      );
      return res.json(savedMedia);
    }

    // Default: return the URLs so the frontend can use them
    res.json(mediaData);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du téléchargement des fichiers', error });
  }
});

export default router;
