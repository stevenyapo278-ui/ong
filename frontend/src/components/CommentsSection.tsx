import { useState } from 'react';
import { useComments } from '../hooks/useComments';

interface Props {
  postId: string;
}

const CommentsSection: React.FC<Props> = ({ postId }) => {
  const { list, create } = useComments(postId);
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !authorEmail || !content) return;
    await create.mutateAsync({ authorName, authorEmail, content });
    setContent('');
  };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-black text-foreground transition-colors">Commentaires</h2>

      <form onSubmit={handleSubmit} className="bg-background-alt border border-border rounded-2xl p-6 space-y-4 shadow-sm transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
            placeholder="Votre nom"
            className="px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          <input
            type="email"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            required
            placeholder="Votre email"
            className="px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="Votre commentaire…"
          className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={create.isPending}
            className="px-6 py-2.5 text-sm font-black bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-60 transition-all shadow-lg shadow-primary/20 uppercase tracking-widest"
          >
            Publier le commentaire
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {list.isLoading ? (
          <p className="text-sm text-foreground-muted animate-pulse transition-colors">Chargement des commentaires…</p>
        ) : list.data && list.data.length > 0 ? (
          list.data.map((c) => (
            <div key={c.id} className="bg-background-alt border border-border rounded-2xl p-6 shadow-sm transition-colors">
              <p className="text-sm font-black text-foreground transition-colors">{c.authorName}</p>
              <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest transition-colors">
                {new Date(c.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
              <p className="mt-3 text-sm text-foreground leading-relaxed whitespace-pre-wrap transition-colors">{c.content}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-foreground-muted transition-colors">Pas encore de commentaire. Soyez le premier à réagir.</p>
        )}
      </div>
    </section>
  );
};

export default CommentsSection;

