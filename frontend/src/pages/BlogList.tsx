import { useSearchParams, Link } from 'react-router-dom';
import { usePostsList } from '../hooks/usePostsList';
import { Search, Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { stripHtml } from '../utils/text';
import { formatPostType } from '../utils/post';
import { getCategories, Category } from '../api/categoriesApi';
import { fixUrl } from '../api/axios';
import SEO from '../components/SEO';

const PAGE_SIZE = 9;

const BlogList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categories, setCategories] = useState<Category[]>([]);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const categoryId = searchParams.get('categoryId') || undefined;
  const type = searchParams.get('type') || undefined;

  const { data, isLoading } = usePostsList({
    status: 'PUBLISHED',
    page,
    pageSize: PAGE_SIZE,
    search: searchParams.get('search') || undefined,
    categoryId,
    type,
  });

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  const updateParams = (nextPage: number, nextSearch?: string, nextCategoryId?: string) => {
    const params: Record<string, string> = {};
    if (nextPage > 1) params.page = String(nextPage);
    if (nextSearch) params.search = nextSearch;
    if (nextCategoryId) params.categoryId = nextCategoryId;
    setSearchParams(params);
  };

  const setCategoryFilter = (id: string | null) => {
    const params: Record<string, string> = {};
    if (searchParams.get('search')) params.search = searchParams.get('search')!;
    if (id) params.categoryId = id;
    setSearchParams(params);
  };

  return (
    <div className="space-y-12 py-10 max-w-7xl mx-auto px-4 pt-32">
      <SEO 
        title="Actualités & Impact" 
        description="Suivez les dernières nouvelles, récits et rapports d'impact de l'ONG Bien Vivre Ici en Côte d'Ivoire. Restez informé de nos projets humanitaires."
        canonical="/actualites"
      />
      {/* ── Header ── */}
      <div className="text-center space-y-6 max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight transition-colors">
          Journal de nos <span className="text-primary">actions</span>.
        </h1>
        <p className="text-lg text-foreground-muted font-medium transition-colors">
          Retrouvez ici tous les récits, rapports et actualités de nos missions humanitaires à travers le monde.
        </p>

        <form
          className="relative max-w-md mx-auto group"
          onSubmit={(e) => {
            e.preventDefault();
            updateParams(1, search || undefined);
          }}
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-foreground-muted group-focus-within:text-primary transition-colors" size={20} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un récit, un pays, une mission..."
            className="w-full pl-12 pr-4 py-4 bg-background-alt border-2 border-border rounded-[20px] text-foreground focus:outline-none focus:border-primary focus:bg-background transition-all shadow-sm group-hover:shadow-md font-medium"
          />
        </form>

        {categories.length > 0 && (
          <div className="flex items-center sm:justify-center gap-2 mt-8 overflow-x-auto pb-4 sm:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            <button
              onClick={() => setCategoryFilter(null)}
              className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${!categoryId
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-background-alt text-foreground-muted hover:bg-background hover:text-primary border border-border'
                }`}
            >
              Tous les Récits
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${categoryId === cat.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-background-alt text-foreground-muted hover:bg-background hover:text-primary border border-border'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="space-y-4">
              <div className="aspect-[16/10] bg-background-alt rounded-[30px] animate-pulse transition-colors" />
              <div className="h-4 bg-background-alt rounded w-1/4 animate-pulse" />
              <div className="h-6 bg-background-alt rounded w-3/4 animate-pulse" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24 bg-background-alt rounded-[40px] border-2 border-dashed border-border transition-colors">
          <BookOpen size={48} className="mx-auto text-foreground-muted/30 mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2 transition-colors">Aucun résultat trouvé</h3>
          <p className="text-foreground-muted transition-colors">Essayez d'autres mots-clés pour trouver ce que vous cherchez.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {items.map((post) => (
              <Link
                key={post.id}
                to={`/actualites/${post.slug}`}
                className="group flex flex-col space-y-5"
              >
                <div className="relative aspect-[16/10] bg-background-alt rounded-[30px] overflow-hidden shadow-sm transition-all duration-500 group-hover:shadow-primary/10 group-hover:shadow-xl group-hover:-translate-y-2 border border-border">
                  {post.featuredImage ? (
                    <img
                      src={fixUrl(post.featuredImage)}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-foreground-muted font-serif italic text-4xl">
                      Récit
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-background/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm border border-border transition-colors">
                      {formatPostType(post.type)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 px-2">
                  <div className="flex items-center gap-4 text-[11px] font-bold text-foreground-muted uppercase tracking-widest transition-colors">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {new Date(post.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    {post.author && (
                      <div className="flex items-center gap-1.5">
                        <User size={12} />
                        {post.author.name}
                      </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-black text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2 transition-all">
                    {post.title}
                  </h3>

                  <p className="text-foreground-muted font-medium leading-relaxed line-clamp-3 text-sm transition-colors">
                    {post.excerpt || (post.content ? stripHtml(post.content).slice(0, 150) + '...' : 'Découvrez les détails de cette mission humanitaire passionnante.')}
                  </p>

                  <div className="pt-2 flex items-center text-primary font-bold text-sm group-hover:translate-x-1 transition-transform transition-colors">
                    Lire l'article <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 pt-12">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => updateParams(page - 1, searchParams.get('search') || undefined, categoryId)}
                className="w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-border bg-background text-foreground-muted hover:border-primary hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
              >
                <ArrowRight size={20} className="rotate-180" />
              </button>

              <div className="px-6 py-3 rounded-2xl bg-background-alt border-2 border-border text-sm font-black text-foreground transition-colors">
                PAGE {page} <span className="text-foreground-muted/30 mx-2">/</span> {totalPages}
              </div>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => updateParams(page + 1, searchParams.get('search') || undefined, categoryId)}
                className="w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-border bg-background text-foreground-muted hover:border-primary hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogList;
