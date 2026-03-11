import { useRef } from 'react';
import { usePostsList } from '../hooks/usePostsList';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { fixUrl } from '../api/axios';
import { formatPostType } from '../utils/post';
import { stripHtml } from '../utils/text';

const PostCard = ({ post }: { post: any }) => {
    return (
        <Link 
            to={`/actualites/${post.slug}`}
            className="flex-shrink-0 w-[300px] md:w-[450px] group"
        >
            <div className="relative aspect-[16/10] rounded-[32px] overflow-hidden mb-6 border border-border shadow-xl group-hover:shadow-primary/10 transition-all">
                {post.featuredImage ? (
                    <img 
                        src={fixUrl(post.featuredImage)} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-background-alt flex items-center justify-center text-foreground-muted italic font-serif text-2xl">
                        Récit
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-background/80 backdrop-blur-md border border-border rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
                        {formatPostType(post.type)}
                    </span>
                </div>
            </div>
            
            <div className="space-y-4 px-2">
                <div className="flex items-center gap-4 text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-1.5"><Clock size={12} /> 5 MIN READ</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>{new Date(post.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                <h3 className="text-2xl font-black text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2 italic">
                    {post.title}
                </h3>
                <p className="text-foreground-muted text-sm line-clamp-2 font-medium">
                    {post.excerpt || (post.content ? stripHtml(post.content).slice(0, 120) + '...' : '')}
                </p>
                <div className="pt-2">
                    <span className="inline-flex items-center gap-2 text-primary font-black text-[11px] uppercase tracking-widest group-hover:gap-4 transition-all">
                        Lire l'article <ChevronRight size={14} />
                    </span>
                </div>
            </div>
        </Link>
    );
};

const LatestPosts = () => {
    const { data, isLoading } = usePostsList({
        status: 'PUBLISHED',
        page: 1,
        pageSize: 6
    });

    const targetRef = useRef<HTMLDivElement>(null);

    const posts = data?.items ?? [];

    if (isLoading || posts.length === 0) return null;

    return (
        <section className="py-32 bg-background-alt/30 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-16">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                    <div className="space-y-4">
                        <h2 className="text-primary font-black tracking-[0.3em] text-[10px] uppercase">ACTUALITÉS & RÉCITS</h2>
                        <h3 className="text-5xl md:text-7xl font-black text-foreground leading-none tracking-tighter">
                            Le journal de <br />
                            <span className="text-secondary italic">notre impact.</span>
                        </h3>
                    </div>
                    <Link 
                        to="/blog" 
                        className="flex items-center gap-3 px-8 py-4 bg-background border border-border rounded-2xl text-foreground font-black text-[11px] uppercase tracking-widest hover:border-primary hover:text-primary transition-all shadow-sm"
                    >
                        Voir tout le journal <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Horizontal Scroll Area */}
            <div className="relative">
                <div 
                    ref={targetRef}
                    className="flex gap-8 overflow-x-auto pb-12 px-6 md:px-[calc((100vw-1280px)/2+24px)] no-scrollbar cursor-grab active:cursor-grabbing snap-x"
                >
                    {posts.map((post) => (
                        <div key={post.id} className="snap-start">
                            <PostCard post={post} />
                        </div>
                    ))}
                    
                    {/* Final Card: Link to Blog */}
                    <Link 
                        to="/blog"
                        className="flex-shrink-0 w-[300px] md:w-[450px] aspect-[16/10] rounded-[32px] bg-primary flex flex-col items-center justify-center text-center p-12 group hover:bg-foreground transition-all duration-500 shadow-2xl snap-start"
                    >
                        <BookOpen size={64} className="text-white mb-6 group-hover:scale-110 transition-transform" />
                        <h4 className="text-2xl font-black text-white italic mb-4">Découvrez tous nos autres récits d'impact</h4>
                        <div className="flex items-center gap-2 text-white/70 font-black text-[11px] uppercase tracking-[0.2em]">
                            Accéder au blog <ArrowRight size={14} />
                        </div>
                    </Link>
                </div>
                
                {/* Visual indicator / custom scrollbar logic if needed, but horizontal scroll is often enough */}
            </div>
        </section>
    );
};

export default LatestPosts;
