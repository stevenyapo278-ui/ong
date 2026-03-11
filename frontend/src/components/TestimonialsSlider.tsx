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
                        detailContent: "Avec un don de 170€ (soit 42€ après réduction fiscale), vous permettez par exemple de construire un puits. C'est tout un village qui a accès à de l'eau potable.",
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
        <section className="py-16 md:py-24 bg-background overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16 space-y-4 md:space-y-6">
                    <h2 className="text-3xl md:text-6xl font-black text-foreground tracking-tight">
                        Nos victoires en <span className="text-primary">témoignages !</span> <span className="text-secondary">.</span>
                    </h2>
                    <p className="max-w-3xl mx-auto text-foreground-muted font-medium text-base md:text-lg leading-relaxed">
                        Changer les choses, vous y croyez ? Nous aussi ! Ces femmes et hommes ont réussi à sortir de la précarité.
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
                            className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-0 items-center min-h-[500px] md:min-h-[600px]"
                        >
                            {/* Text Block */}
                            <div className="w-full lg:col-span-6 z-20 lg:-mr-20 order-2 lg:order-1">
                                <div className="bg-background-alt p-6 md:p-14 rounded-[30px] md:rounded-[40px] shadow-2xl border border-border space-y-6 md:space-y-8 relative">
                                    {/* Accent line */}
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-20 md:w-2 md:h-32 bg-secondary rounded-r-full" />
                                    
                                    <h3 className="text-xl md:text-3xl font-black text-foreground leading-tight italic">
                                        {current.title}
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <Quote size={32} className="text-primary opacity-20 md:w-10 md:h-10" />
                                        <p className="text-base md:text-lg text-foreground-muted italic leading-relaxed font-serif pl-0 md:pl-4">
                                            {current.quote}
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-border space-y-6">
                                        <div className="space-y-2">
                                            <h4 className="text-lg md:text-xl font-black text-foreground">{current.detailTitle}</h4>
                                            <p className="text-xs md:text-sm text-foreground-muted font-medium leading-relaxed">
                                                {current.detailContent}
                                            </p>
                                        </div>

                                        <Link
                                            to={current.ctaLink}
                                            className="inline-flex items-center justify-center gap-4 bg-secondary text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-foreground transition-all shadow-xl shadow-secondary/20 group w-full sm:w-auto"
                                        >
                                            {current.ctaText}
                                            <Heart size={18} className="group-hover:scale-110 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Image Block */}
                            <div className="w-full lg:col-span-7 lg:col-start-6 z-10 aspect-[4/3] md:aspect-auto h-[300px] md:h-full order-1 lg:order-2">
                                <div className="w-full h-full rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl relative">
                                    {current.image ? (
                                        <img 
                                            src={current.image} 
                                            alt={current.title} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-foreground flex items-center justify-center">
                                            <Quote size={80} className="text-white/10" />
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
