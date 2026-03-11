import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Heart, 
    ShieldCheck, 
    CreditCard, 
    CheckCircle2, 
    AlertCircle,
    Zap,
    Coins
} from 'lucide-react';
import api from '../api/axios';
import { useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';

const DonorsSpace = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const statusParam = searchParams.get('status');
    
    const [amount, setAmount] = useState<number>(5000);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

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
                    email: email || 'contact@ongbienvivreici.org',
                    phone: phone || ''
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
            <SEO 
                title="Soutenir nos Actions" 
                description="Faites un don à l'ONG Bien Vivre Ici. Votre générosité permet de financer des actions concrètes pour la santé, l'éducation et le développement à Abidjan."
                canonical="/espace-donateur"
            />
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
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-foreground-muted uppercase tracking-[0.2em]">Votre Nom <span className="text-primary">*</span></label>
                                            <input 
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Ex: Jean Kouassi"
                                                required
                                                className="w-full h-14 px-6 bg-background border-2 border-border rounded-2xl outline-none focus:border-primary transition-all text-sm font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-foreground-muted uppercase tracking-[0.2em]">Numéro de téléphone <span className="text-primary">*</span></label>
                                            <input 
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="Ex: +225 07 00 00 00 00"
                                                required
                                                className="w-full h-14 px-6 bg-background border-2 border-border rounded-2xl outline-none focus:border-primary transition-all text-sm font-bold"
                                            />
                                        </div>
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

                                <div className="flex items-center justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all pt-6">
                                    <img src="/assets/orange_logo.svg" className="h-6 object-contain" alt="Orange Money" title="Orange Money" />
                                    <img src="/assets/mtn_logo.svg" className="h-6 object-contain" alt="MTN MoMo" title="MTN MoMo" />
                                    <img src="/assets/wave_logo.png" className="h-6 object-contain" alt="Wave" title="Wave" />
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default DonorsSpace;
