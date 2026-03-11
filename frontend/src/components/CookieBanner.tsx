import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed bottom-6 left-6 right-6 z-[200] flex justify-center pointer-events-none"
                >
                    <div className="w-full max-w-4xl bg-background-alt/80 backdrop-blur-2xl border border-border p-6 md:p-8 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] pointer-events-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 overflow-hidden relative group"
                    >
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors" />
                        
                        <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Cookie size={32} />
                        </div>

                        <div className="flex-grow space-y-2 text-center md:text-left">
                            <h4 className="text-xl font-black text-foreground italic uppercase flex items-center justify-center md:justify-start gap-2">
                                Respect de la vie privée
                            </h4>
                            <p className="text-sm text-foreground-muted font-medium leading-relaxed max-w-2xl">
                                Nous utilisons des cookies pour améliorer votre expérience d'impact et analyser notre trafic. En continuant, vous acceptez notre <Link to="/politique-cookies" className="text-primary font-bold hover:underline">politique de gestion des cookies</Link>.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                            <button 
                                onClick={handleDecline}
                                className="w-full sm:w-auto px-8 py-3.5 text-[10px] font-black text-foreground-muted uppercase tracking-widest hover:text-foreground transition-colors"
                            >
                                Refuser
                            </button>
                            <button 
                                onClick={handleAccept}
                                className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group/btn"
                            >
                                Tout accepter <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <button 
                            onClick={() => setIsVisible(false)}
                            className="absolute top-4 right-4 text-foreground-muted/40 hover:text-primary transition-colors p-2"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieBanner;
