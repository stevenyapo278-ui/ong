import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Comment, getComments, createComment } from '../api/commentsApi';

export const useComments = (postId: string | undefined) => {
  const queryClient = useQueryClient();

  const list = useQuery<Comment[]>({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId as string),
    enabled: !!postId,
  });

  const create = useMutation({
    mutationFn: (data: { authorName: string; authorEmail: string; content: string }) =>
      createComment(postId as string, data),
    onSuccess: () => {
      if (!postId) return;
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  return { list, create };
};

