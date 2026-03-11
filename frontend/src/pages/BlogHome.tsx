import { Link } from 'react-router-dom';
import { Search, ArrowRight, TrendingUp, Sparkles, BookOpen, Clock } from 'lucide-react';
import { useState } from 'react';
import { usePostsList } from '../hooks/usePostsList';
import { stripHtml } from '../utils/text';
import { formatPostType } from '../utils/post';
import { fixUrl } from '../api/axios';

const BlogHome = () => {
  const [search, setSearch] = useState('');
  const { data, isLoading } = usePostsList({
    status: 'PUBLISHED',
    page: 1,
    pageSize: 10,
    search: search || undefined,
  });

  const items = data?.items ?? [];
  const featured = items.find((post) => post.featured) ?? items[0];
  const rest = featured ? items.filter((p) => p.id !== featured.id) : items;

  return (
    <div className="space-y-12 md:space-y-20 pb-20">

      {/* ── Magazine Hero Section ── */}
      <section className="relative overflow-hidden pt-6 md:pt-10">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-primary/5 rounded-l-[100px] transform translate-x-20 transition-colors"></div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="lg:col-span-12 space-y-6 text-center max-w-3xl mx-auto mb-6 md:mb-10">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase transition-colors">
              <Sparkles size={14} className="mr-2" /> NOS DERNIERS RÉCITS
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-foreground tracking-tight leading-[1.1] transition-colors">
              Le Journal de <span className="text-primary">l'Impact</span>.
            </h1>
            <p className="text-base md:text-lg text-foreground-muted font-medium leading-relaxed transition-colors">
              Plongez au cœur de nos missions à travers des reportages exclusifs, des témoignages poignants et des analyses de terrain.
            </p>
            <div className="relative max-w-xl mx-auto group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Chercher une mission..."
                className="w-full pl-14 md:pl-16 pr-6 md:pr-8 py-4 md:py-5 bg-background border-2 border-border rounded-[24px] shadow-sm group-hover:shadow-primary/5 group-hover:shadow-xl transition-all focus:outline-none focus:border-primary font-medium text-foreground text-sm"
              />
            </div>
          </div>

          {featured && (
            <div className="lg:col-span-12 group">
              <Link to={`/actualites/${featured.slug}`} className="relative block bg-background rounded-[30px] md:rounded-[50px] overflow-hidden shadow-2xl shadow-primary/5 border border-border group transition-all">
                <div className="flex flex-col lg:flex-row min-h-[400px] md:min-h-[500px]">
                  <div className="lg:w-3/5 relative overflow-hidden aspect-video lg:aspect-auto">
                    {featured.featuredImage ? (
                      <img
                        src={fixUrl(featured.featuredImage)}
                        alt={featured.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-background-alt flex items-center justify-center text-foreground-muted italic text-4xl md:text-6xl font-serif">À la une</div>
                    )}
                    <div className="absolute top-6 left-6 md:top-10 md:left-10">
                      <span className="px-4 md:px-6 py-1.5 md:py-2 bg-primary text-white rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/30">À LA UNE</span>
                    </div>
                  </div>
                  <div className="lg:w-2/5 p-8 md:p-20 flex flex-col justify-center space-y-4 md:space-y-6">
                    <div className="flex items-center gap-2 text-primary font-black tracking-widest uppercase text-[9px] md:text-[10px] transition-colors">
                      <TrendingUp size={14} /> TENDANCE ACTUELLE
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-foreground-muted font-medium leading-relaxed line-clamp-3 md:line-clamp-4 transition-colors text-sm md:text-base">
                      {featured.excerpt || (featured.content ? stripHtml(featured.content).slice(0, 180) + '...' : '')}
                    </p>
                    <div className="flex items-center gap-6 pt-4 border-t border-border transition-colors">
                      <div className="flex items-center gap-2 font-black text-foreground-muted text-[10px] uppercase tracking-wider transition-colors">
                        <Clock size={14} /> 5 MIN
                      </div>
                      <div className="flex items-center gap-2 font-black text-foreground-muted text-[10px] uppercase tracking-wider transition-colors">
                        <BookOpen size={14} /> {formatPostType(featured.type)}
                      </div>
                    </div>
                    <div className="pt-4 md:pt-6">
                      <span className="inline-flex w-full md:w-auto items-center justify-center px-10 py-4 bg-foreground text-background rounded-2xl font-black text-sm uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all shadow-xl shadow-primary/5 group-hover:scale-105 active:scale-95">
                        Lire le récit <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Grid Gallery ── */}
      <section className="max-w-7xl mx-auto px-4 space-y-8 md:space-y-12">
        <div className="flex items-end justify-between border-b-2 border-border pb-6 md:pb-8 transition-colors">
          <div className="space-y-1 md:space-y-2">
            <h2 className="text-primary font-black tracking-[0.2em] text-[9px] md:text-[10px] uppercase transition-colors">RÉCITS RÉCENTS</h2>
            <h3 className="text-2xl md:text-4xl font-black text-foreground tracking-tight transition-colors">Dernières immersions.</h3>
          </div>
          <Link to="/actualites" className="flex items-center gap-2 text-foreground-muted font-black tracking-widest uppercase text-[10px] md:text-[11px] hover:text-primary transition-colors group">
            Tout <span className="hidden sm:inline">le journal</span> <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {[1, 2, 3].map(i => <div key={i} className="aspect-[4/5] bg-background-alt rounded-[30px] md:rounded-[40px] animate-pulse transition-colors" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 md:gap-y-16">
            {rest.map((post) => (
              <Link
                key={post.id}
                to={`/actualites/${post.slug}`}
                className="group flex flex-col"
              >
                <div className="relative aspect-[4/5] bg-background-alt rounded-[30px] md:rounded-[40px] overflow-hidden mb-6 md:mb-8 shadow-sm transition-all duration-700 group-hover:shadow-primary/5 group-hover:shadow-2xl group-hover:-translate-y-2 md:group-hover:-translate-y-3 group-hover:rotate-1">
                  {post.featuredImage ? (
                    <img
                      src={fixUrl(post.featuredImage)}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-foreground-muted text-4xl italic font-serif">Récit</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap shadow-lg">
                      LIRE L'ARTICLE <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
                <div className="px-2 md:px-4 space-y-3 md:space-y-4">
                  <span className="text-primary font-black tracking-widest uppercase text-[8px] md:text-[9px] px-3 py-1 bg-primary/10 rounded-full border border-primary/20 transition-colors">
                    {formatPostType(post.type)}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4 text-[9px] md:text-[10px] font-bold text-foreground-muted uppercase tracking-widest transition-colors">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="w-1 h-1 bg-border rounded-full"></span>
                    <span>5 MIN READ</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Subscription Footer ── */}
      <section className="max-w-7xl mx-auto px-4 pt-6 md:pt-10">
        <div className="bg-foreground rounded-[40px] md:rounded-[60px] p-8 md:p-20 relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -mr-40 -mt-40"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-12 text-center lg:text-left">
            <div className="space-y-4 md:space-y-6 max-w-xl">
              <h2 className="text-primary font-black tracking-widest uppercase text-[10px]">RESTEZ INFORMÉS</h2>
              <h3 className="text-3xl md:text-5xl font-black text-background leading-tight transition-colors">Recevez nos derniers <span className="text-primary">récits</span> directement.</h3>
              <p className="text-background/60 font-medium transition-colors text-sm md:text-base">Une newsletter mensuelle pour suivre l'évolution de nos projets et comprendre l'impact de vos dons.</p>
            </div>
            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="w-full sm:min-w-[300px] px-8 py-4 md:py-5 bg-background/5 border-2 border-background/10 rounded-2xl text-background placeholder-background/60 focus:outline-none focus:border-primary transition-all font-medium"
              />
              <button className="w-full sm:w-auto px-10 py-4 md:py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-background hover:text-foreground transition-all transform hover:scale-105 active:scale-95 text-[10px] tracking-widest uppercase whitespace-nowrap">
                M'abonner
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogHome;
