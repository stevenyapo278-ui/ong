import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isVideo = file.mimetype.startsWith('video/');
    cb(null, isVideo ? 'uploads/videos' : 'uploads/images');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté. Seuls les images (JPEG, PNG, WEBP) et vidéos (MP4, MOV) sont acceptés.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});
