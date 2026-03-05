import { useQuery } from '@tanstack/react-query';
import { getPosts, PostsQueryParams, PaginatedPosts } from '../api/postsApi';

export const usePostsList = (params: PostsQueryParams) => {
  return useQuery<PaginatedPosts>({
    queryKey: ['posts', params],
    queryFn: () => getPosts(params),
  });
};

