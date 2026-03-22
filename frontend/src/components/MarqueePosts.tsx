import { motion } from 'framer-motion';
import { usePostsList } from '../hooks/usePostsList';
import { fixUrl } from '../api/axios';
import { Link } from 'react-router-dom';

const MarqueePosts = () => {
    const { data, isLoading } = usePostsList({ 
        status: 'PUBLISHED', 
        page: 1, 
        pageSize: 10 
    });
    const posts = data?.items ?? [];

    if (isLoading || posts.length === 0) return null;

    // On triple la liste pour assurer une continuité parfaite
    const marqueePosts = [...posts, ...posts, ...posts];

    return (
        <section className="py-6 md:py-10 bg-[#0f172a] overflow-hidden relative border-y border-white/5">
            {/* Dégradés sur les bords pour l'effet de fondu */}
            <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#0f172a] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#0f172a] to-transparent z-10 pointer-events-none" />

            <div className="flex select-none">
                <motion.div 
                    className="flex gap-12 md:gap-20 items-center whitespace-nowrap"
                    initial={{ x: 0 }}
                    animate={{ x: "-33.33%" }}
                    transition={{ 
                        duration: 40, 
                        repeat: Infinity, 
                        ease: "linear" 
                    }}
                >
                    {marqueePosts.map((post, i) => (
                        <Link 
                            key={`${post.id}-${i}`}
                            to={`/actualites/${post.slug}`}
                            className="flex items-center gap-6 group"
                        >
                            {post.featuredImage && (
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl overflow-hidden border border-white/10 shrink-0 transform group-hover:scale-110 transition-transform duration-500">
                                    <img 
                                        src={fixUrl(post.featuredImage)} 
                                        alt={post.title}
                                        className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                                    />
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Lire l'article
                                </span>
                                <span className="text-white/40 group-hover:text-white font-black text-2xl md:text-5xl uppercase tracking-tighter italic transition-all duration-500">
                                    {post.title}
                                </span>
                            </div>
                            <span className="text-secondary text-3xl md:text-5xl font-black ml-4 opacity-30 group-hover:rotate-180 transition-transform duration-1000">/</span>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default MarqueePosts;
