import api from './axios';

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
}

export const getComments = async (postId: string): Promise<Comment[]> => {
  const res = await api.get(`/comments/post/${postId}`);
  return res.data;
};

export const createComment = async (postId: string, data: { authorName: string; authorEmail: string; content: string }) => {
  const res = await api.post(`/comments/post/${postId}`, data);
  return res.data as Comment;
};

