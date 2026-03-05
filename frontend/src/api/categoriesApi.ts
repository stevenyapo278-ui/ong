import api from './axios';

export interface Category {
  id: string;
  name: string;
  createdAt?: string;
  _count?: { posts: number };
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories');
  return response.data;
};

export const createCategory = async (name: string): Promise<Category> => {
  const response = await api.post('/categories', { name });
  return response.data;
};

export const updateCategory = async (id: string, name: string): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, { name });
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};
