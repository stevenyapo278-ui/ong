import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, PieChart, Users, ArrowRight, Wallet, Receipt, Sparkles } from 'lucide-react';

const DonorsSpace = () => {
    return (
        <div className="min-h-screen bg-white font-sans overflow-hidden">
            {/* ── HERO SECTION ── */}
            <section className="relative h-[60vh] md:h-[70vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/assets/donors_space_hero.png" 
                        alt="Donors Impact" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#0f172a]/60 to-transparent" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-white space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        className="space-y-6 max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-md rounded-full border border-primary/30 text-primary-muted text-[10px] font-black uppercase tracking-[0.2em]">
                            <Heart size={12} className="text-primary" /> Espace Philanthropie
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tighter italic">
                            Votre générosité est <br />
                            <span className="text-primary-muted group-hover:text-primary transition-colors">notre moteur.</span>
                        </h1>
                        <p className="text-lg text-white/70 font-medium leading-relaxed">
                            Bienvenue dans votre espace dédié. Ici, nous célébrons l'impact de vos dons et nous vous garantissons une transparence totale sur l'utilisation de chaque centime investi pour l'humanitaire.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── IMPACT STATS ── */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
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
                                className="p-10 bg-white rounded-[40px] shadow-xl shadow-black/5 hover:shadow-2xl hover:-translate-y-2 transition-all group"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 ${item.color} group-hover:scale-110 transition-transform`}>
                                    <item.icon size={28} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-4">{item.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── DONOR TOOLS ── */}
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Gérez vos dons en <span className="text-primary italic">toute liberté</span></h2>
                            <p className="text-slate-500 font-medium lg:max-w-md">
                                Connectez-vous à votre compte pour suivre l'historique de vos versements, télécharger vos reçus fiscaux ou modifier votre abonnement solidaire.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-primary/30 transition-all cursor-pointer">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary"><Receipt size={22} /></div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm italic">Reçus Fiscaux</h4>
                                    <p className="text-[11px] text-slate-500 uppercase tracking-widest font-black">Téléchargement immédiat</p>
                                </div>
                                <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-primary" />
                            </div>
                            <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-primary/30 transition-all cursor-pointer">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-secondary"><Wallet size={22} /></div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm italic">Prélèvements Automatiques</h4>
                                    <p className="text-[11px] text-slate-500 uppercase tracking-widest font-black">Gestion de mon engagement</p>
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
                                <button className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-white hover:text-primary transition-all">Se Connecter</button>
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
