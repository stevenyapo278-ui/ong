import { motion } from 'framer-motion';
import { Building, Target, Handshake, Mail, BarChart3, Briefcase, Zap } from 'lucide-react';

const PartnersSpace = () => {
    return (
        <div className="min-h-screen bg-background font-sans overflow-hidden">
            {/* ── HERO SECTION ── */}
            <section className="relative h-[65vh] md:h-[75vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/assets/partners_space_hero.png" 
                        alt="Corporate Partners" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-transparent" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-white">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="space-y-10 max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary/20 backdrop-blur-md rounded-full border border-secondary/30 text-secondary text-[11px] font-black uppercase tracking-[0.25em]">
                            <Handshake size={14} className="text-secondary" /> Partenariats Stratégiques
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black leading-[1] tracking-tighter uppercase italic">
                            Bâtissons <br />
                            <span className="text-secondary opacity-60">notre impact</span> <br />
                            ensemble.
                        </h1>
                        <p className="text-xl text-white/70 font-medium leading-relaxed max-w-xl">
                            Les partenariats avec les entreprises et les institutions sont le socle de nos interventions à grande échelle. Transformons votre RSE en action concrète sur le terrain.
                        </p>
                        <button className="px-10 py-5 bg-foreground text-background rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-secondary hover:text-white transition-all transform hover:-translate-y-1">
                            Devenir Partenaire
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ── PARTNERSHIP MODES ── */}
            <section className="py-24 bg-background relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24 space-y-6">
                        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">Nos modes de <br className="md:hidden" /><span className="text-secondary italic">collaboration</span></h2>
                        <div className="h-1.5 w-24 bg-secondary rounded-full mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Building, title: "Mécénat de Compétence", desc: "Mettez le savoir-faire de vos collaborateurs au service de nos projets humanitaires." },
                            { icon: Target, title: "Produits Partage", desc: "Reversez un petit pourcentage de vos ventes pour financer une cause spécifique." },
                            { icon: BarChart3, title: "Soutien Financier", desc: "Accompagnez l'ensemble de nos programmes par un méećnat financier pluriannuel." },
                            { icon: Zap, title: "Urgence Réponse", desc: "Activez un fonds de solidarité rapide pour agir immédiatement en cas de crise majeure." }
                        ].map((mode, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15 }}
                                className="p-8 bg-background-alt rounded-[40px] border border-border group hover:bg-foreground transition-all duration-500"
                            >
                                <div className="w-16 h-16 rounded-3xl bg-secondary/10 flex items-center justify-center mb-8 group-hover:bg-secondary transition-all">
                                    <mode.icon size={24} className="text-secondary group-hover:text-white transition-all" />
                                </div>
                                <h3 className="text-lg font-black text-foreground group-hover:text-background mb-4 italic leading-tight">{mode.title}</h3>
                                <p className="text-foreground-muted text-sm font-medium group-hover:text-background/60 leading-relaxed">{mode.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CALL TO ACTION ── */}
            <section className="py-32 bg-secondary/10 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-12 relative z-10">
                    <div className="w-24 h-24 bg-background rounded-[40px] flex items-center justify-center shadow-xl shadow-secondary/20 border border-border">
                        <Briefcase className="text-secondary" size={40} />
                    </div>
                    <div className="space-y-6 max-w-3xl">
                        <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-tight">
                            Votre impact commence par un <br className="hidden md:block" />
                            <span className="text-secondary italic">rendez-vous.</span>
                        </h2>
                        <p className="text-lg text-foreground-muted font-medium">
                            Chaque partenariat est unique. Contactez notre équipe dédiée aux relations institutionnelles pour co-construire un projet qui ressemble à vos valeurs.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6">
                        <button className="px-12 py-5 bg-secondary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-secondary/20 hover:scale-105 active:scale-95 transition-all">
                            Télécharger notre brochure
                        </button>
                        <button className="px-12 py-5 bg-foreground text-background rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-white transition-all flex items-center gap-3">
                            <Mail size={16} /> Demander un contact
                        </button>
                    </div>
                </div>

                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-900/5 rounded-full blur-[100px] -ml-48 -mb-48" />
            </section>
        </div>
    );
};

export default PartnersSpace;
