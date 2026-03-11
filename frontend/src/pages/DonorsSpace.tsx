import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Heart, 
    ShieldCheck, 
    PieChart, 
    Users, 
    ArrowRight, 
    Wallet, 
    Receipt, 
    Sparkles, 
    CreditCard, 
    CheckCircle2, 
    AlertCircle,
    Zap,
    Coins
} from 'lucide-react';
import api from '../api/axios';
import { useSearchParams } from 'react-router-dom';

const DonorsSpace = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const statusParam = searchParams.get('status');
    
    const [amount, setAmount] = useState<number>(5000);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const amounts = [2000, 5000, 10000, 25000, 50000];

    useEffect(() => {
        if (statusParam) {
            const timer = setTimeout(() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('status');
                newParams.delete('donationId');
                setSearchParams(newParams);
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [statusParam, searchParams, setSearchParams]);

    const handleDonation = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const finalAmount = customAmount ? parseInt(customAmount) : amount;
            
            if (!finalAmount || finalAmount < 100) {
                alert("Le montant minimum est de 100 XOF");
                setLoading(false);
                return;
            }

            const response = await api.post('/payments/initiate', {
                amount: finalAmount,
                description: `Donation de ${name || 'un donateur'} via Genius Pay`,
                customer: {
                    name: name || 'Donateur',
                    email: email || 'contact@ongbienvivreici.org'
                }
            });

            if (response.data.checkout_url) {
                window.location.href = response.data.checkout_url;
            }
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Erreur lors de l'initiation du paiement.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans overflow-hidden">
            {/* ── Status Notifications ── */}
            <AnimatePresence>
                {statusParam === 'success' && (
                    <motion.div 
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -100 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-6"
                    >
                        <div className="bg-green-500 text-white p-6 rounded-[32px] shadow-2xl flex items-center gap-4 border border-green-400/30 backdrop-blur-md">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="font-black uppercase tracking-widest text-[10px] opacity-80">Action réussie</p>
                                <p className="font-bold text-sm leading-tight">Merci infiniment ! Votre don a bien été reçu et va servir à transformer des vies.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
                {statusParam === 'error' && (
                    <motion.div 
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -100 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-6"
                    >
                        <div className="bg-red-500 text-white p-6 rounded-[32px] shadow-2xl flex items-center gap-4 border border-red-400/30 backdrop-blur-md">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <p className="font-black uppercase tracking-widest text-[10px] opacity-80">Erreur de paiement</p>
                                <p className="font-bold text-sm leading-tight">Le paiement n'a pas pu être finalisé. Veuillez réessayer ou nous contacter.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── HERO SECTION ── */}
            <section className="relative h-[65vh] md:h-[75vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/assets/donors_space_hero.png" 
                        alt="Donors Impact" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/95 via-[#0f172a]/70 to-transparent" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-white space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        className="space-y-8 max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-md rounded-full border border-primary/30 text-primary-muted text-[10px] font-black uppercase tracking-[0.2em]">
                            <Heart size={12} className="text-primary" /> Espace Philanthropie
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black leading-[1] tracking-tighter italic uppercase">
                            Votre générosité<br />
                            <span className="text-primary opacity-80">notre énergie.</span>
                        </h1>
                        <p className="text-xl text-white/70 font-medium leading-relaxed max-w-xl">
                            Chaque don est un pas vers un avenir meilleur pour les communautés de Cocody. Nous transformons votre soutien en impact concret, avec une transparence absolue.
                        </p>
                        
                        <div className="flex flex-wrap gap-4 pt-4">
                            <a href="#don-direct" className="px-10 py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all">
                                Faire un don maintenant
                            </a>
                            <button className="px-10 py-5 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/20 transition-all">
                                Découvrir nos projets
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── DONATION FORM SECTION ── */}
            <section id="don-direct" className="py-32 bg-background relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-20">
                    
                    <div className="lg:col-span-5 space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-primary font-black tracking-[0.2em] text-xs uppercase">ACTION DIRECTE</h2>
                            <h3 className="text-5xl font-black text-foreground leading-tight">Soutenez nos <br /><span className="text-primary italic">actions locales.</span></h3>
                            <p className="text-lg text-foreground-muted font-medium leading-relaxed">
                                Financement de projets scolaires, électrification rurale ou aide alimentaire d'urgence : votre contribution va directement là où elle est nécessaire.
                            </p>
                        </div>

                        <div className="space-y-8">
                            { [
                                { icon: Zap, label: "Rapide", desc: "Paiement en moins de 30 secondes via Mobile Money." },
                                { icon: ShieldCheck, label: "Sécurisé", desc: "Transactions cryptées et protégées par Genius Pay." },
                                { icon: Coins, label: "Sans frais cachés", desc: "Le montant que vous donnez est ce que nous recevons." }
                            ].map((feat, i) => (
                                <div key={i} className="flex gap-6 items-start group">
                                    <div className="w-12 h-12 rounded-2xl bg-background-alt flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                        <feat.icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-foreground uppercase tracking-widest text-[11px] mb-1">{feat.label}</h4>
                                        <p className="text-sm text-foreground-muted font-medium">{feat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-background-alt rounded-[50px] p-8 md:p-16 border border-border shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                            
                            <form onSubmit={handleDonation} className="relative z-10 space-y-10">
                                {/* Amount Picker */}
                                <div className="space-y-6">
                                    <label className="text-[11px] font-black text-foreground-muted uppercase tracking-[0.2em]">Sélectionnez un montant (FCFA)</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {amounts.map((amt) => (
                                            <button
                                                key={amt}
                                                type="button"
                                                className={`py-4 rounded-2xl font-black text-sm transition-all border-2 ${amount === amt && !customAmount ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' : 'bg-background border-border text-foreground-muted hover:border-primary'}`}
                                            >
                                                {amt.toLocaleString()}
                                            </button>
                                        ))}
                                        <div className="col-span-1 md:col-span-1 border-2 border-border bg-background rounded-2xl flex items-center px-4 focus-within:border-primary transition-all">
                                            <input 
                                                type="number"
                                                placeholder="Autre"
                                                className="w-full h-full bg-transparent outline-none text-sm font-black text-foreground"
                                                value={customAmount}
                                                onChange={(e) => { setCustomAmount(e.target.value); setAmount(0); }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-foreground-muted uppercase tracking-[0.2em]">Votre Nom (Optionnel)</label>
                                        <input 
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Ex: Jean Kouassi"
                                            className="w-full h-14 px-6 bg-background border-2 border-border rounded-2xl outline-none focus:border-primary transition-all text-sm font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-foreground-muted uppercase tracking-[0.2em]">Votre Email (Optionnel)</label>
                                        <input 
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Ex: jean@email.com"
                                            className="w-full h-14 px-6 bg-background border-2 border-border rounded-2xl outline-none focus:border-primary transition-all text-sm font-bold"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-20 bg-foreground text-background rounded-3xl font-black uppercase tracking-[0.25em] text-sm shadow-2xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : <CreditCard size={20} />}
                                    Faire mon don
                                </button>

                                <div className="flex items-center justify-center gap-6 opacity-30 grayscale pt-6">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Orange_logo.svg/1024px-Orange_logo.svg.png" className="h-6" alt="Orange" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/MTN_Logo.svg/1024px-MTN_Logo.svg.png" className="h-6" alt="MTN" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d3/Wave_momey_logo.png" className="h-6" alt="Wave" />
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── IMPACT STATS ── */}
            <section className="py-24 bg-background-alt relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: ShieldCheck, title: "100% Transparence", desc: "Consultez nos rapports financiers audités et certifiés chaque année.", color: "text-green-500" },
                            { icon: PieChart, title: "Allocation Directe", desc: "85% de vos dons vont directement aux programmes sur le terrain.", color: "text-primary" },
                            { icon: Users, title: "Impact Humain", desc: "Chaque donateur change la vie de 4 personnes en moyenne par an.", color: "text-secondary" }
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className="p-10 bg-background rounded-[40px] shadow-xl shadow-black/5 hover:shadow-2xl hover:-translate-y-2 transition-all group border border-border"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-background-alt flex items-center justify-center mb-8 ${item.color} group-hover:scale-110 transition-transform`}>
                                    <item.icon size={28} />
                                </div>
                                <h3 className="text-xl font-black text-foreground mb-4">{item.title}</h3>
                                <p className="text-foreground-muted font-medium leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── DONOR TOOLS ── */}
            <section className="py-32 bg-background">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-foreground tracking-tight">Gérez vos dons en <span className="text-primary italic">toute liberté</span></h2>
                            <p className="text-foreground-muted font-medium lg:max-w-md">
                                Connectez-vous à votre compte pour suivre l'historique de vos versements, télécharger vos reçus fiscaux ou modifier votre abonnement solidaire.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-6 p-6 bg-background-alt rounded-3xl border border-border group hover:border-primary/30 transition-all cursor-pointer">
                                <div className="w-12 h-12 bg-background rounded-2xl shadow-sm flex items-center justify-center text-primary"><Receipt size={22} /></div>
                                <div>
                                    <h4 className="font-black text-foreground text-sm italic">Reçus Fiscaux</h4>
                                    <p className="text-[11px] text-foreground-muted uppercase tracking-widest font-black">Téléchargement immédiat</p>
                                </div>
                                <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-primary" />
                            </div>
                            <div className="flex items-center gap-6 p-6 bg-background-alt rounded-3xl border border-border group hover:border-primary/30 transition-all cursor-pointer">
                                <div className="w-12 h-12 bg-background rounded-2xl shadow-sm flex items-center justify-center text-secondary"><Wallet size={22} /></div>
                                <div>
                                    <h4 className="font-black text-foreground text-sm italic">Prélèvements Automatiques</h4>
                                    <p className="text-[11px] text-foreground-muted uppercase tracking-widest font-black">Gestion de mon engagement</p>
                                </div>
                                <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-secondary" />
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-4 bg-primary/5 rounded-[60px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative bg-[#0f172a] p-12 rounded-[50px] shadow-2xl space-y-8 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
                            <div className="space-y-4 relative z-10 text-center lg:text-left">
                                <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto lg:mx-0"><Sparkles className="text-primary" size={32} /></div>
                                <h3 className="text-3xl font-black text-white italic">Accès Donateur</h3>
                                <p className="text-white/60 font-medium">Accédez à votre espace sécurisé pour visualiser votre impact.</p>
                            </div>
                            <div className="space-y-4 relative z-10">
                                <button className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-background hover:text-primary transition-all">Se Connecter</button>
                                <button className="w-full py-3 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Première connexion ? Activer mon compte</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DonorsSpace;
