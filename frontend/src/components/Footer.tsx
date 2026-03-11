import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Mail, ArrowRight, Instagram, Twitter, Facebook, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    const handleNewsletter = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus('saving');
        try {
            await api.post('/subscribers', { email });
            setStatus('success');
            setEmail('');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <footer className="w-full flex flex-col font-sans transition-colors overflow-hidden">
            {/* ── SECTION 1: STATS & IMPACT (Dark Overlay) ── */}
            <div className="relative min-h-[500px] flex items-center py-20 overflow-hidden">
                {/* Image de fond avec overlay sombre */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/footer_stats_bg.png"
                        alt="Background Impact"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#0f172a]/85 backdrop-blur-sm shadow-inner transition-colors" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-white">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
                                BIEN VIVRE ICI <br />
                                <span className="text-primary italic">en chiffres</span>
                            </h2>
                            <p className="text-lg text-white/70 font-medium leading-relaxed max-w-xl">
                                Propulser le changement par la transparence, le récit et l'action humanitaire directe sur le terrain. Chaque jour, nos équipes oeuvrent pour un avenir plus juste et solidaire en Côte d'Ivoire.
                            </p>
                            <button className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] hover:text-primary transition-all group">
                                En savoir + <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 md:gap-16">
                            {[
                                { value: "12", label: "ans", sub: "d'existence" },
                                { value: "25k", label: "millions", sub: "personnes soutenues" },
                                { value: "45", label: "projets", sub: "réalisés en local" }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center text-center space-y-4 group">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-white/20 flex flex-col items-center justify-center backdrop-blur-md group-hover:border-primary/50 group-hover:scale-105 transition-all duration-500 shadow-2xl">
                                        <span className="text-3xl md:text-4xl font-black leading-none">{stat.value}</span>
                                        <span className="text-[10px] uppercase font-black tracking-widest text-primary mt-1">{stat.label}</span>
                                    </div>
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60">{stat.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── SECTION 2: INFOS & NEWSLETTER ── */}
            <div className="grid grid-cols-1 lg:grid-cols-10 shrink-0">
                {/* Colonne de Gauche (Infos) - Fond Blanc */}
                <div className="lg:col-span-6 bg-background py-20 px-6 md:px-16 space-y-16 flex flex-col justify-between border-r border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        {/* Branding & Bio */}
                        <div className="space-y-8">
                            <div className="flex items-center group cursor-pointer">
                                <div className="flex items-center justify-center w-14 h-14 bg-background-alt rounded-2xl shadow-xl shadow-black/5 group-hover:scale-110 transition-all border border-border">
                                    <img src="/assets/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-2xl font-black text-[#0f172a] tracking-tighter leading-none italic uppercase">BIEN VIVRE ICI</p>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Plateforme Humanitaire</p>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-foreground-muted leading-relaxed max-w-sm">
                                ONG BIEN VIVRE ICI est une organisation loi 1901, apolitique et non confessionnelle, reconnue d'utilité publique. Nous luttons contre la pauvreté et les inégalités en apportant une aide directe et transparente.
                            </p>
                            <div className="flex gap-4">
                                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                    <button key={i} className="w-10 h-10 rounded-xl bg-background-alt text-foreground-muted border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                        <Icon size={18} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Footer */}
                        <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <h4 className="text-[11px] font-black text-foreground uppercase tracking-[0.25em]">Vos Espaces</h4>
                                <ul className="space-y-4">
                                    <li>
                                        <button onClick={() => navigate('/espace-donateur')} className="text-[13px] font-bold text-foreground-muted hover:text-primary transition-colors hover:translate-x-1 inline-block transform text-left">Espace donateur</button>
                                    </li>
                                    <li>
                                        <button onClick={() => navigate('/espace-partenaires')} className="text-[13px] font-bold text-foreground-muted hover:text-primary transition-colors hover:translate-x-1 inline-block transform text-left">Espace partenaires</button>
                                    </li>
                                    <li>
                                        <button className="text-[13px] font-bold text-foreground-muted hover:text-primary transition-colors hover:translate-x-1 inline-block transform text-left">Espace presse</button>
                                    </li>
                                    <li>
                                        <button className="text-[13px] font-bold text-foreground-muted hover:text-primary transition-colors hover:translate-x-1 inline-block transform text-left">Recrutement</button>
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-[11px] font-black text-foreground uppercase tracking-[0.25em]">Contact Direct</h4>
                                <ul className="space-y-5">
                                    <li className="flex items-start gap-3 text-foreground-muted">
                                        <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                                        <span className="text-[12px] font-bold leading-tight uppercase tracking-tight">II Plateaux 7ème Tranche derrière le 22ème arrondissement de Cocody. BP 712 Cidex 3 Abidjan</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-foreground-muted">
                                        <Phone size={16} className="text-primary shrink-0" />
                                        <span className="text-[12px] font-bold leading-none">+225 0707824784</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            &copy; {new Date().getFullYear()} ONG BIEN VIVRE ICI. RÉCITS D'IMPACT EN DIRECT.
                        </p>
                        <div className="flex gap-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            <button onClick={() => navigate('/plan-du-site')} className="hover:text-primary transition-colors">Plan du site</button>
                            <button onClick={() => navigate('/mentions-legales')} className="hover:text-primary transition-colors">Mentions Légales</button>
                            <button onClick={() => navigate('/politique-cookies')} className="hover:text-primary transition-colors">Politique Cookies</button>
                        </div>
                    </div>
                </div>

                {/* Colonne de Droite (Newsletter) - Fond Orange */}
                <div className="lg:col-span-4 bg-secondary flex flex-col items-center justify-center py-24 px-8 md:px-16 text-white text-center">
                    <div className="max-w-md w-full space-y-10 animate-in fade-in zoom-in duration-700">
                        <div className="w-20 h-20 bg-white/20 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl backdrop-blur-md">
                            <Mail size={32} className="text-white" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none italic uppercase">
                                S'informer,<br />
                                <span className="opacity-70">c'est déjà s'engager</span>
                            </h2>
                            <p className="text-white/80 font-black text-xs uppercase tracking-[0.3em]">Je m'abonne à la newsletter d'impact</p>
                        </div>

                        <form onSubmit={handleNewsletter} className="relative w-full">
                            <input
                                type="email"
                                placeholder="Votre adresse email d'impact..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-16 px-8 bg-white text-[#0f172a] rounded-2xl font-bold text-sm focus:outline-none shadow-2xl transition-all"
                                required
                            />
                            <button 
                                type="submit"
                                disabled={status === 'saving'}
                                className="absolute right-2 top-2 bottom-2 px-8 bg-[#cc7200] hover:bg-[#b06300] text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl disabled:opacity-50"
                            >
                                {status === 'saving' ? '...' : 'Envoyer'}
                            </button>
                            
                            {status === 'success' && (
                                <p className="absolute -bottom-8 left-0 right-0 text-[10px] font-black text-[#0f172a] uppercase tracking-widest animate-in slide-in-from-top-2">✓ Merci pour votre engagement !</p>
                            )}
                            {status === 'error' && (
                                <p className="absolute -bottom-8 left-0 right-0 text-[10px] font-black text-red-900 uppercase tracking-widest animate-in slide-in-from-top-2">⚠ Erreur de connexion.</p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
