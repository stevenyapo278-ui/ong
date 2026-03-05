import api from './axios';

export interface PostsQueryParams {
  status?: string;
  search?: string;
  type?: string;
  categoryId?: string;
  page?: number;
  pageSize?: number;
}

export interface PostItem {
  id: string;
  title: string;
  slug: string;
  content?: string | null;
  excerpt?: string | null;
  featuredImage?: string | null;
  featured: boolean;
  type: string;
  status: string;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  author?: {
    name: string;
    email: string;
  };
  categories?: { id: string; name: string }[];
  media?: { id: string; url: string; type: string }[];
}

export interface PaginatedPosts {
  items: PostItem[];
  total: number;
  page: number;
  pageSize: number;
}

export const getPosts = async (params: PostsQueryParams = {}): Promise<PaginatedPosts> => {
  const response = await api.get('/posts', {
    params,
  });
  return response.data;
};

export const getPostBySlug = async (slug: string): Promise<PostItem> => {
  const response = await api.get(`/posts/slug/${slug}`);
  return response.data;
};

export const getPostById = async (id: string): Promise<PostItem> => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};


