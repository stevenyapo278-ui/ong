import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Testimonial {
    id: string;
    title: string;
    quote: string;
    detailTitle: string;
    detailContent: string;
    image: string;
    ctaText: string;
    ctaLink: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TestimonialsSlider = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await axios.get(`${API_URL}/testimonials?active=true`);
                setTestimonials(response.data);
            } catch (error) {
                console.error('Error fetching testimonials:', error);
                // Fallback dummy data if API fails or is empty for now
                setTestimonials([
                    {
                        id: '1',
                        title: "Jupiter a mis fin à la pénurie d'eau dans son village en Indonésie",
                        quote: "Pour lutter contre la pénurie d'eau durant les saisons sèches, CARE a soutenu l'action de Jupiter. Plus de 100 puits ont été construits dans plusieurs villages. « Je voulais notamment aider les femmes qui devaient aller loin pour aller chercher de l'eau. »",
                        detailTitle: "Faites la différence !",
                        detailContent: "Avec 170€ par mois pendant un an, soit 42€ après réduction fiscale, vous permettez par exemple de construire un puits. C'est tout un village qui a accès à de l'eau potable.",
                        image: "/assets/testimony_water.png",
                        ctaText: "JE FAIS UN DON",
                        ctaLink: "/espace-donateur"
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    if (loading || testimonials.length === 0) return null;

    const current = testimonials[currentIndex];

    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16 space-y-6">
                    <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight">
                        Nos victoires en <span className="text-primary">témoignages !</span> <span className="text-secondary">.</span>
                    </h2>
                    <p className="max-w-3xl mx-auto text-foreground-muted font-medium text-lg leading-relaxed">
                        Changer les choses, vous y croyez ? Nous aussi ! Ces femmes et hommes ont réussi à sortir de la précarité. Et votre soutien compte.
                    </p>
                </div>

                {/* Slider Content */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center min-h-[600px]"
                        >
                            {/* Left Text Block (Overlapping) */}
                            <div className="lg:col-span-6 z-20 lg:-mr-20">
                                <div className="bg-background-alt p-8 md:p-14 rounded-3xl md:rounded-[40px] shadow-2xl border border-border space-y-8 relative">
                                    {/* Accent line */}
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-32 bg-secondary rounded-r-full" />
                                    
                                    <h3 className="text-2xl md:text-3xl font-black text-foreground leading-tight italic">
                                        {current.title}
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <Quote size={40} className="text-primary opacity-20" />
                                        <p className="text-lg text-foreground-muted italic leading-relaxed font-serif pl-4">
                                            {current.quote}
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-border space-y-6">
                                        <div className="space-y-2">
                                            <h4 className="text-xl font-black text-foreground">{current.detailTitle}</h4>
                                            <p className="text-sm text-foreground-muted font-medium leading-relaxed">
                                                {current.detailContent}
                                            </p>
                                        </div>

                                        <Link
                                            to={current.ctaLink}
                                            className="inline-flex items-center gap-4 bg-secondary text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-foreground transition-all shadow-xl shadow-secondary/20 group"
                                        >
                                            {current.ctaText}
                                            <Heart size={18} className="group-hover:scale-110 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Right Image Block */}
                            <div className="lg:col-span-7 lg:col-start-6 z-10 aspect-[4/3] lg:aspect-auto h-full min-h-[400px]">
                                <div className="w-full h-full rounded-[40px] overflow-hidden shadow-2xl relative">
                                    {current.image ? (
                                        <img 
                                            src={current.image.startsWith('http') ? current.image : current.image} 
                                            alt={current.title} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-foreground flex items-center justify-center">
                                            <Quote size={100} className="text-white/10" />
                                        </div>
                                    )}
                                    {/* Subtle Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent lg:opacity-50" />
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation controls */}
                    <div className="flex flex-col items-center gap-8 mt-16">
                        <div className="flex items-center gap-8">
                            <button 
                                onClick={prev}
                                className="w-14 h-14 rounded-full border border-border flex items-center justify-center text-foreground-muted hover:border-primary hover:text-primary transition-all active:scale-90"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            
                            <div className="flex items-center gap-3">
                                {testimonials.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentIndex(i)}
                                        className={`w-3 h-3 rounded-full transition-all ${
                                            i === currentIndex ? 'bg-secondary w-8' : 'bg-border hover:bg-primary/40'
                                        }`}
                                    />
                                ))}
                            </div>

                            <button 
                                onClick={next}
                                className="w-14 h-14 rounded-full border border-border flex items-center justify-center text-foreground-muted hover:border-primary hover:text-primary transition-all active:scale-90"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSlider;
