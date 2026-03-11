import { Building, Target, Handshake, Mail, BarChart3, Briefcase, Zap, FileDown, X, Building2, User, Phone, Send, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useOverlay } from '../context/OverlayContext';
import { motion, AnimatePresence } from 'framer-motion';

const PartnersSpace = () => {
    const [brochureUrl, setBrochureUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showNotification } = useOverlay();

    const [formData, setFormData] = useState({
        organization: '',
        contactName: '',
        email: '',
        phone: '',
        message: ''
    });

    useEffect(() => {
        const fetchBrochure = async () => {
            try {
                const response = await api.get('/settings');
                setBrochureUrl(response.data.brochureUrl);
            } catch (err) {
                console.error("Failed to fetch brochure", err);
            }
        };
        fetchBrochure();
    }, []);

    const handleDownloadBrochure = () => {
        if (brochureUrl) {
            window.open(brochureUrl, '_blank');
        } else {
            showNotification("La brochure n'est pas disponible pour le moment.", "info");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await api.post('/partner-requests', formData);
            showNotification("Votre demande a bien été envoyée. Notre équipe reviendra vers vous rapidement.", "success");
            setIsModalOpen(false);
            setFormData({ organization: '', contactName: '', email: '', phone: '', message: '' });
        } catch (err) {
            showNotification("Une erreur s'est produite lors de l'envoi de votre demande.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="px-10 py-5 bg-foreground text-background rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-secondary hover:text-white transition-all transform hover:-translate-y-1"
                        >
                            Devenir Partenaire
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ── PARTNERSHIP MODES ── */}
            <section className="py-24 bg-background relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24 space-y-6">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black text-foreground tracking-tight"
                        >
                            Nos modes de <br className="md:hidden" /><span className="text-secondary italic">collaboration</span>
                        </motion.h2>
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
                        <button 
                            onClick={handleDownloadBrochure}
                            className="px-12 py-5 bg-secondary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-secondary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                        >
                            <FileDown size={18} /> Télécharger notre brochure
                        </button>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="px-12 py-5 bg-foreground text-background rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-white transition-all flex items-center gap-3"
                        >
                            <Mail size={16} /> Demander un contact
                        </button>
                    </div>
                </div>

                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-900/5 rounded-full blur-[100px] -ml-48 -mb-48" />
            </section>

            {/* ── CONTACT MODAL ── */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-background rounded-[40px] shadow-2xl border border-border overflow-hidden"
                        >
                            <div className="p-10 border-b border-border flex justify-between items-center bg-background-alt/30">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                                        <Handshake size={24} />
                                    </div>
                                    <h3 className="text-xl font-black text-foreground uppercase tracking-widest italic">Demande de Partenariat</h3>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-4 bg-background-alt hover:bg-background-alt/50 rounded-2xl text-foreground-muted transition-all"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] pl-1">Organisation / Entreprise</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                                            <input 
                                                type="text" required
                                                value={formData.organization}
                                                onChange={e => setFormData({...formData, organization: e.target.value})}
                                                placeholder="Ex: Entreprise S.A."
                                                className="w-full pl-14 pr-6 py-4 bg-background-alt border border-border rounded-2xl focus:border-secondary outline-none font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] pl-1">Nom du contact</label>
                                        <div className="relative">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                                            <input 
                                                type="text" required
                                                value={formData.contactName}
                                                onChange={e => setFormData({...formData, contactName: e.target.value})}
                                                placeholder="Votre nom complet"
                                                className="w-full pl-14 pr-6 py-4 bg-background-alt border border-border rounded-2xl focus:border-secondary outline-none font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] pl-1">Email professionnel</label>
                                        <div className="relative">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                                            <input 
                                                type="email" required
                                                value={formData.email}
                                                onChange={e => setFormData({...formData, email: e.target.value})}
                                                placeholder="contact@entreprise.com"
                                                className="w-full pl-14 pr-6 py-4 bg-background-alt border border-border rounded-2xl focus:border-secondary outline-none font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] pl-1">Téléphone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                                            <input 
                                                type="tel"
                                                value={formData.phone}
                                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                                placeholder="+225 ..."
                                                className="w-full pl-14 pr-6 py-4 bg-background-alt border border-border rounded-2xl focus:border-secondary outline-none font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] pl-1">Message / Intention</label>
                                    <textarea 
                                        rows={4}
                                        value={formData.message}
                                        onChange={e => setFormData({...formData, message: e.target.value})}
                                        placeholder="Expliquez-nous brièvement comment vous souhaitez collaborer..."
                                        className="w-full px-6 py-4 bg-background-alt border border-border rounded-2xl focus:border-secondary outline-none font-medium leading-relaxed"
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-6 bg-secondary text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                    {isSubmitting ? "ENVOI EN COURS..." : "ENVOYER MA DEMANDE"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PartnersSpace;
