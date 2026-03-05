import { useQuery } from '@tanstack/react-query';
import { getPostById, PostItem } from '../api/postsApi';

export const usePostById = (id: string | undefined) => {
  return useQuery<PostItem>({
    queryKey: ['postById', id],
    queryFn: () => getPostById(id as string),
    enabled: !!id,
  });
};

