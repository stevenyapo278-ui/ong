import { useQuery } from '@tanstack/react-query';
import { getPostBySlug, PostItem } from '../api/postsApi';

export const usePost = (slug: string | undefined) => {
  return useQuery<PostItem>({
    queryKey: ['post', slug],
    queryFn: () => getPostBySlug(slug as string),
    enabled: !!slug,
  });
};

