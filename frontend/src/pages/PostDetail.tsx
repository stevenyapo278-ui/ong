import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Link as LinkIcon, ChevronRight, Eye, FileText } from 'lucide-react';
import { usePost } from '../hooks/usePost';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet-async';
import { formatPostType } from '../utils/post';
import { usePostsList } from '../hooks/usePostsList';
import CommentsSection from '../components/CommentsSection';
import { stripHtml } from '../utils/text';
import { useEffect, useState, useMemo } from 'react';

const ReadingProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-1.5 bg-primary z-[100] transition-all duration-100"
      style={{ width: `${scrollProgress}%` }}
    />
  );
};

const PostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = usePost(slug);

  // Évaluation du temps de lecture
  const readingTime = post?.content
    ? Math.max(1, Math.ceil(stripHtml(post.content).split(' ').length / 200))
    : 1;

  const firstCategoryId = post?.categories?.[0]?.id;
  const { data: relatedData } = usePostsList(
    firstCategoryId
      ? { status: 'PUBLISHED', categoryId: firstCategoryId, page: 1, pageSize: 4 }
      : { status: 'PUBLISHED', page: 1, pageSize: 4 }
  );

  const related = (relatedData?.items ?? []).filter((p) => p.id !== post?.id).slice(0, 3);

  const sanitizedContent = useMemo(() => {
    if (!post?.content) return '';
    const clean = DOMPurify.sanitize(post.content, {
      ALLOWED_TAGS: ['p', 'div', 'span', 'strong', 'em', 'ul', 'ol', 'li', 'h2', 'h3', 'blockquote', 'a', 'img', 'video', 'source', 'iframe', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'mark'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'controls', 'allow', 'allowfullscreen', 'frameborder', 'style', 'data-size', 'data-type', 'data-name', 'data-cols', 'class', 'colspan', 'rowspan', 'data-colwidth'],
    });
    // Ajout automatique du lazy-loading sur toutes les images publiques
    return clean.replace(/<img /g, '<img loading="lazy" ');
  }, [post?.content]);

  const siteUrl = window.location.origin;
  const postUrl = `${siteUrl}/actualites/${post?.slug}`;
  const seoTitle = post?.seoTitle || post?.title || "Récit | ONG Impact";
  const seoDescription = post?.seoDescription || (post?.excerpt ? stripHtml(post.excerpt).slice(0, 160) : "Découvrez les missions de notre ONG.");
  const seoImage = post?.featuredImage || `${siteUrl}/assets/hero.png`;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background transition-colors">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto px-6 space-y-6 bg-background transition-colors">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
          <ChevronRight size={40} className="rotate-180" />
        </div>
        <h2 className="text-3xl font-black text-foreground leading-tight tracking-tight transition-colors">Récit introuvable.</h2>
        <p className="text-foreground-muted font-medium leading-relaxed font-sans transition-colors">Il semble que cet article ait été déplacé ou n&apos;existe plus. Explorez nos autres missions.</p>
        <Link to="/actualites" className="inline-flex items-center px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
          <ArrowLeft size={18} className="mr-2" /> Retour aux actualités
        </Link>
      </div>
    );
  }

  return (
    <article className="pb-24 max-w-7xl mx-auto space-y-12 px-6 lg:px-12">

      {/* ── SEO dynamique (Helmet) ── */}
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        {/* Open Graph (LinkedIn, Facebook) */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={seoImage} />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={seoImage} />
        {/* Canonical URL */}
        <link rel="canonical" href={postUrl} />
      </Helmet>
      {/* ── Banner de Prévisualisation ── */}
      {post.status !== 'PUBLISHED' && (
        <div className="sticky top-24 z-50 mx-6 md:mx-0 p-4 bg-primary/90 backdrop-blur-md text-white rounded-[24px] shadow-2xl shadow-primary/20 border border-primary/30 flex items-center justify-between animate-in slide-in-from-top-4 duration-500 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">
              <Eye size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/70">Mode Prévisualisation</span>
              <span className="text-sm font-bold">Cet article est un {post.status === 'PENDING' ? 'en attente de validation' : 'brouillon'} et n&apos;est pas visible par le public.</span>
            </div>
          </div>
          <Link to="/dashboard" className="hidden sm:block px-6 py-2 bg-white text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-background-alt transition-colors">
            Retour Admin
          </Link>
        </div>
      )}

      {/* ── Progress Bar (Optimisé : Ne re-render que lui-même) ── */}
      <ReadingProgressBar />

      <header className="space-y-8 pt-8">
        <Link to="/actualites" className="inline-flex items-center text-sm font-black text-primary tracking-wider group hover:-translate-x-1 transition-all">
          <ArrowLeft size={16} className="mr-2" /> JOURNAL DES ACTIONS
        </Link>

        {/* Featured Card */}
        <div className="relative rounded-[40px] overflow-hidden shadow-2xl shadow-primary/5 bg-background-alt aspect-video md:aspect-[21/9] transition-colors border border-border">
          {post.featuredImage ? (
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground-muted font-serif italic text-5xl">Récit</div>
          )}
          <div className="absolute top-8 left-8">
            <span className="px-5 py-2 bg-primary text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
              {formatPostType(post.type)}
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-black text-foreground leading-[1.1] tracking-tight transition-colors">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black transition-colors">
                {post.author?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="text-xs font-black text-foreground-muted uppercase tracking-wider transition-colors">Écrit par</p>
                <p className="text-sm font-bold text-foreground transition-colors">{post.author?.name || 'Administrateur'}</p>
              </div>
            </div>

            <Sep />

            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-foreground-muted" />
              <p className="text-sm font-bold text-foreground-muted">
                {new Date(post.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>

            <Sep />

            <div className="flex items-center gap-2">
              <Clock size={18} className="text-foreground-muted" />
              <p className="text-sm font-bold text-foreground-muted">{readingTime} min de lecture</p>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-3">
              <button title="Partager sur Facebook" className="w-9 h-9 rounded-full bg-background-alt border border-border flex items-center justify-center text-foreground-muted hover:text-primary hover:bg-background hover:border-primary transition-all shadow-sm"><Facebook size={16} /></button>
              <button title="Partager sur Twitter" className="w-9 h-9 rounded-full bg-background-alt border border-border flex items-center justify-center text-foreground-muted hover:text-primary hover:bg-background hover:border-primary transition-all shadow-sm"><Twitter size={16} /></button>
              <button title="Copier le lien" className="w-9 h-9 rounded-full bg-background-alt border border-border flex items-center justify-center text-foreground-muted hover:text-primary hover:bg-background hover:border-primary transition-all shadow-sm"><LinkIcon size={16} /></button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <section className="max-w-6xl mx-auto">
        {sanitizedContent && (
          <div
            className="rich-content"
            dangerouslySetInnerHTML={{
              __html: sanitizedContent,
            }}
          />
        )}
      </section>

      {/* ── Galerie ── */}
      {post.media && post.media.length > 0 && (
        <section className="bg-background-alt rounded-[50px] p-8 md:p-16 space-y-10 transition-colors border border-border">
          <div className="text-center space-y-3">
            <h2 className="text-primary font-black tracking-[0.2em] text-sm uppercase transition-colors">DOCUMENTS & VISUELS</h2>
            <h3 className="text-3xl font-black text-foreground tracking-tight transition-colors transition-all">Galerie de la mission</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {post.media.map((m) => (
              <div key={m.id} className="aspect-[4/3] bg-background p-2 rounded-3xl shadow-sm border border-border overflow-hidden transform hover:-rotate-1 hover:scale-105 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center gap-3">
                {m.type.startsWith('image/') ? (
                  <img src={m.url} alt="" loading="lazy" className="w-full h-full object-cover rounded-2xl" />
                ) : m.type.startsWith('video/') ? (
                  <video src={m.url} controls className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <a href={m.url} target="_blank" rel="noopener noreferrer" className="w-full h-full flex flex-col items-center justify-center p-6 text-center hover:bg-primary/5 transition-colors rounded-2xl group">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <FileText size={32} />
                    </div>
                    <p className="mt-4 text-xs font-black uppercase tracking-widest text-foreground truncate max-w-full px-2">
                      {m.url.split('/').pop() || 'Document'}
                    </p>
                    <span className="text-[10px] font-bold text-primary mt-1">Télécharger</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Related articles ── */}
      {related.length > 0 && (
        <section className="max-w-4xl mx-auto space-y-10 pt-16 border-t border-border transition-colors">
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-foreground tracking-tight transition-colors transition-all">Ces récits peuvent vous <span className="text-primary">inspirer</span>.</h3>
            <Link to="/actualites" className="text-primary font-bold hover:underline mb-2 transition-colors">Tout voir</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((item) => (
              <Link
                key={item.id}
                to={`/actualites/${item.slug}`}
                className="group space-y-4"
              >
                <div className="aspect-[4/3] rounded-3xl bg-background-alt overflow-hidden shadow-lg shadow-primary/5 group-hover:shadow-primary/10 transition-all border border-border">
                  <img src={item.featuredImage || '/assets/hero.png'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h4 className="font-black text-foreground leading-tight group-hover:text-primary transition-colors transition-all line-clamp-2">{item.title}</h4>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Commentaires ── */}
      <section className="max-w-3xl mx-auto pt-20">
        <div className="bg-background-alt flex items-center gap-4 p-4 rounded-full mb-12 border border-border transition-colors">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white"><Share2 size={16} /></div>
          <p className="text-sm font-bold text-foreground-muted tracking-tight transition-colors transition-all">REJOIGNEZ LA DISCUSSION SUR CE PROJET</p>
        </div>
        <CommentsSection postId={post.id} />
      </section>
    </article>
  );
};

const Sep = () => <div className="hidden md:block w-px h-6 bg-border transition-colors" />;

export default PostDetail;
