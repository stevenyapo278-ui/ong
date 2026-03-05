import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import uploadRoutes from './routes/uploadRoutes';
import commentRoutes from './routes/commentRoutes';
import subscriberRoutes from './routes/subscriberRoutes';
import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);




app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

