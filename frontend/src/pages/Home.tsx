import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useOverlay } from '../context/OverlayContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import Counter from '../components/Counter';
import FAQ from '../components/FAQ';
import OurCombats from '../components/OurCombats';
import LatestPosts from '../components/LatestPosts';
import TestimonialsSlider from '../components/TestimonialsSlider';
import SEO from '../components/SEO';

const Home = () => {
  const { showNotification } = useOverlay();

  return (
    <div className="flex flex-col">
      <SEO 
        title="Accueil" 
        description="L'ONG Bien Vivre Ici s'engage pour le bien-être des communautés vulnérables à Cocody, Côte d'Ivoire. Découvrez nos actions pour la santé, l'éducation et le développement durable."
        canonical="/"
      />
      {/* ── 01. Minimalist Hero Section ── */}
      <section className="relative min-h-[80vh] md:min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/hero_ong_ivory_coast.png" 
            alt="Humanitaire en Côte d'Ivoire" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60 md:bg-black/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl space-y-6 md:space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-foreground text-[10px] font-bold uppercase tracking-widest">
              Intervention en cours
            </div>
            
            <h1 className="text-4xl xs:text-5xl md:text-8xl font-black text-white leading-tight tracking-tight">
              Agir pour la <br className="hidden sm:block" />
              <span className="text-secondary italic">Côte d'Ivoire.</span>
            </h1>
            
            <p className="text-base md:text-xl text-white/80 max-w-xl leading-relaxed">
              L'ONG <span className="text-secondary font-bold">Bien Vivre Ici</span> s'engage pour le bien-être des communautés vulnérables à Cocody.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/actualites"
                className="inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-5 bg-primary text-white font-black text-base md:text-lg uppercase tracking-widest rounded-full transition-all hover:bg-primary-dark"
              >
                Nos Actions <ArrowRight size={18} className="ml-2" />
              </Link>
              
              <Link
                to="/blog"
                className="inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-5 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-black text-base md:text-lg uppercase tracking-widest rounded-full hover:bg-white/20 transition-all text-center"
              >
                Notre Journal
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 02. Impact Ticker ── */}
      <section className="bg-primary py-8 md:py-12 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center text-white">
            <div className="space-y-1">
              <p className="text-3xl md:text-5xl font-black tabular-nums">
                <Counter value={500} suffix="+" />
              </p>
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-80">Familles Soutenues</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl md:text-5xl font-black tabular-nums">
                <Counter value={15} />
              </p>
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-80">Projets Locaux</p>
            </div>
            <div className="space-y-1">
              <p className="text-lg md:text-2xl font-black uppercase italic">Akouai Santai</p>
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-80">Village Pilote</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl md:text-5xl font-black tabular-nums">
                <Counter value={100} suffix="%" />
              </p>
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-80">Transparence</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03. Story Section ── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl aspect-[4/3] md:aspect-auto"
          >
            <img 
              src="/assets/mission_medical.png" 
              alt="Medical Mission" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8"
          >
            <h2 className="text-primary font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase">NOTRE HISTOIRE</h2>
            <h3 className="text-3xl md:text-5xl font-black leading-tight text-foreground">
              Une vision pour le <span className="text-primary">développement</span> local.
            </h3>
            <p className="text-base md:text-lg text-foreground-muted leading-relaxed">
              Basée à Cocody, notre organisation est née d'une volonté simple : permettre à chaque Ivoirien de "bien vivre ici", dans sa communauté.
            </p>
            <Link to="/nos-combats" className="inline-flex items-center gap-2 text-primary font-black uppercase text-[10px] md:text-xs hover:gap-4 transition-all">
              Découvrir nos combats <ChevronRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 04. Our Combats Section ── */}
      <OurCombats />

      {/* ── 05. Latest Posts Section ── */}
      <LatestPosts />

      {/* ── 06. Testimonials Section ── */}
      <TestimonialsSlider />

      {/* ── 07. FAQ Section ── */}
      <FAQ />

      {/* ── 07. Newsletter ── */}
      <section className="px-4 md:px-6 py-16 md:py-24 bg-background border-t border-border">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <h3 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
            Restez informé.
          </h3>
          <p className="text-foreground-muted text-base md:text-lg max-w-xl mx-auto">
            Inscrivez-vous pour recevoir nos derniers récits d'impact.
          </p>

          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
              try {
                await api.post('/subscribers', { email });
                showNotification('Inscription réussie !', 'success');
              } catch (err) {
                showNotification('Une erreur est survenue.', 'error');
              }
            }}
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
          >
            <input 
              name="email"
              type="email" 
              required
              placeholder="votre.email@exemple.com"
              className="flex-1 px-6 py-4 rounded-2xl md:rounded-full bg-background-alt border border-border focus:border-primary outline-none transition-all text-sm"
            />
            <button 
              type="submit"
              className="px-8 py-4 bg-primary text-white font-black uppercase text-[10px] md:text-xs tracking-widest rounded-2xl md:rounded-full hover:bg-primary-dark transition-all shadow-lg active:scale-95"
            >
              S'abonner
            </button>
          </form>
        </div>
      </section>

      {/* ── 08. Final CTA ── */}
      <section className="px-4 md:px-6 py-16 md:py-24">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto bg-foreground rounded-[30px] md:rounded-[40px] p-10 md:p-24 text-center text-background relative overflow-hidden"
        >
          {/* Subtle background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="relative z-10 space-y-6 md:space-y-8">
            <h2 className="text-3xl md:text-6xl font-black leading-tight">
              Le changement commence ici.
            </h2>
            <Link
              to="/espace-donateur"
              className="inline-flex px-10 md:px-12 py-4 md:py-5 bg-primary text-white font-black text-base md:text-lg uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-xl shadow-primary/20"
            >
              Faire un Don
            </Link>
          </div>
        </motion.div>
      </section>

      <div className="h-20" />
    </div>
  );
};

export default Home;
