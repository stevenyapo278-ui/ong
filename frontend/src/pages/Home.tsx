import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Heart, 
  Globe, 
  ChevronRight, 
  ShieldCheck, 
  Droplets, 
  Stethoscope, 
  BookOpen, 
  Activity, 
  Target, 
  MessageSquare,
  HelpingHand
} from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* ── 01. Immersive Hero Section ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Full-bleed Background Image with Layered Overlays */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/hero_impact.png" 
            alt="Humanitarian Impact" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">
          <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-foreground text-xs font-black tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Urgence Humanitaire : Intervention en cours
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.95] tracking-tight">
              Agir pour <br />
              <span className="text-primary italic">l'humanité.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 max-w-xl leading-relaxed font-medium">
              Nous intervenons là où l'espoir s'efface, apportant de l'eau, des soins et une éducation durable aux communautés les plus isolées.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Link
                to="/actualites"
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-primary text-white font-black text-lg uppercase tracking-widest rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/40"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Nos Actions <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              
              <Link
                to="/blog"
                className="inline-flex items-center justify-center px-10 py-5 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-black text-lg uppercase tracking-widest rounded-full hover:bg-white/20 transition-all"
              >
                Notre Journal
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50 text-white hidden md:block">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </div>
      </section>

      {/* ── 02. Real-time Impact Ticker ── */}
      <section className="bg-primary py-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:40px_40px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center text-white">
            <div className="space-y-1">
              <p className="text-4xl md:text-6xl font-black tracking-tighter tabular-nums">1.2M+</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Vies Protégées</p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl md:text-6xl font-black tracking-tighter tabular-nums">480</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Projets Livrés</p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl md:text-6xl font-black tracking-tighter tabular-nums">22</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Pays Partenaires</p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl md:text-6xl font-black tracking-tighter tabular-nums">98%</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Transparence</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03. Mission Split Section ── */}
      <section className="py-24 md:py-40 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="relative z-10 rounded-[60px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] aspect-square lg:aspect-[4/5]">
              <img 
                src="/assets/mission_medical.png" 
                alt="Medical Mission" 
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
              />
            </div>
            {/* Decors */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px] -z-10 animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-blue-500/10 rounded-full blur-[100px] -z-10" />
            
            {/* Floating Trust Card */}
            <div className="absolute -bottom-10 left-10 z-20 bg-background/80 backdrop-blur-2xl p-8 rounded-[40px] border border-border/50 shadow-2xl max-w-[280px]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/40">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="font-black text-foreground text-sm uppercase tracking-widest leading-none">Certifié</p>
                  <p className="text-[10px] text-foreground-muted font-bold uppercase tracking-widest mt-1">Impact Vérifié</p>
                </div>
              </div>
              <p className="text-xs text-foreground-muted leading-relaxed font-medium">
                Chaque euro investi fait l'objet d'un audit public pour garantir un impact maximal sur le terrain.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-primary font-black tracking-[0.3em] text-xs uppercase">NOTRE MISSION</h2>
              <h3 className="text-4xl md:text-6xl font-black text-foreground leading-[1.05] tracking-tight">
                Plus qu'une aide, une <span className="text-primary">promesse</span> de futur.
              </h3>
              <p className="text-lg md:text-xl text-foreground-muted leading-relaxed font-medium">
                Depuis plus de 15 ans, nous construisons des ponts entre la solidarité internationale et les besoins fondamentaux. Notre approche ne se limite pas à l'urgence : nous installons des infrastructures qui dureront des générations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-8 rounded-[40px] bg-background-alt border border-border hover:border-primary/50 transition-all hover:translate-y-[-4px] group">
                <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm border border-border group-hover:scale-110 transition-transform">
                  <Droplets />
                </div>
                <h4 className="text-xl font-black text-foreground mb-2">Eau & Hygiène</h4>
                <p className="text-sm text-foreground-muted leading-relaxed font-medium">Forages profonds et systèmes de filtration solaire pour l'autonomie.</p>
              </div>
              
              <div className="p-8 rounded-[40px] bg-background-alt border border-border hover:border-primary/50 transition-all hover:translate-y-[-4px] group">
                <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm border border-border group-hover:scale-110 transition-transform">
                  <Stethoscope />
                </div>
                <h4 className="text-xl font-black text-foreground mb-2">Santé Mobile</h4>
                <p className="text-sm text-foreground-muted leading-relaxed font-medium">Cliniques itinérantes pour atteindre les populations nomades.</p>
              </div>
            </div>

            <Link to="/actualites" className="inline-flex items-center gap-2 text-primary font-black tracking-widest uppercase text-xs hover:translate-x-2 transition-transform group">
              Découvrir nos rapports d'impact <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 04. Featured Story Highlights ── */}
      <section className="py-24 bg-background-alt border-y border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-primary font-black tracking-[0.3em] text-xs uppercase">RÉCITS DU TERRAIN</h2>
              <h3 className="text-4xl md:text-6xl font-black text-foreground tracking-tight">Le journal de notre impact.</h3>
            </div>
            <Link to="/actualites" className="px-8 py-4 bg-background border border-border rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all">
              Toutes les actualités
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Main Featured */}
            <div className="group relative rounded-[50px] overflow-hidden aspect-[4/5] md:aspect-auto md:h-full min-h-[500px] shadow-2xl">
              <img src="/assets/mission_education.png" alt="Education" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 p-12 space-y-4">
                <span className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">ÉDUCATION</span>
                <h4 className="text-3xl md:text-5xl font-black text-white leading-tight">Éduquer pour briser le cycle de la pauvreté.</h4>
                <p className="text-white/60 font-medium text-lg leading-relaxed line-clamp-2">Comment nos nouveaux centres numériques ouvrent les portes du monde aux jeunes de l'Afrique Centrale.</p>
                <div className="pt-4">
                  <span className="inline-flex items-center gap-2 text-white font-black uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
                    Lire le récit complet <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </div>

            {/* Sub Highlights */}
            <div className="flex flex-col gap-12">
              {[
                { 
                  tag: 'INFRASTRUCTURE', 
                  title: 'Un pont pour la vie : Désenclavement de la vallée de Goma.', 
                  date: '12 MARS 2026',
                  icon: <Activity size={20} />
                },
                { 
                  tag: 'ALIMENTATION', 
                  title: 'Agriculture résiliente : Nourrir 10 000 personnes durablement.', 
                  date: '05 MARS 2026',
                  icon: <Target size={20} />
                }
              ].map((item, i) => (
                <div key={i} className="group cursor-pointer border-b border-border/50 pb-12 hover:border-primary transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-3 py-1 bg-background rounded-lg border border-border text-primary-foreground text-[10px] font-black uppercase tracking-widest">{item.tag}</span>
                    <span className="text-[10px] font-black text-foreground-muted tracking-widest">{item.date}</span>
                  </div>
                  <h4 className="text-3xl font-black text-foreground group-hover:text-primary transition-colors mb-6">{item.title}</h4>
                  <p className="text-foreground-muted font-medium mb-6 leading-relaxed">
                    Une analyse approfondie du projet, des défis rencontrés sur le terrain et de la joie des populations locales lors de l'inauguration.
                  </p>
                  <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                    {item.icon} RÉCIT COMPLET
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 05. Partners & Scale Section ── */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-foreground-muted font-black tracking-[0.3em] text-[10px] uppercase mb-16">ILS NOUS FONT CONFIANCE</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
            {/* Representative logos placeholders */}
            <Globe size={48} />
            <Heart size={48} />
            <Target size={48} />
            <Activity size={48} />
            <ShieldCheck size={48} />
            <Droplets size={48} />
          </div>
        </div>
      </section>

      {/* ── 06. Final CTA Call ── */}
      <section className="px-6 py-20 md:py-40 relative bottom-[-100px] z-20">
        <div className="max-w-6xl mx-auto bg-foreground rounded-[60px] md:rounded-[100px] p-12 md:p-32 text-center relative overflow-hidden shadow-[0_100px_150px_-50px_rgba(0,0,0,0.4)]">
          {/* Background FX */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] -ml-48 -mb-48" />
          
          <div className="relative z-10 space-y-12">
            <h2 className="text-4xl md:text-8xl font-black text-background leading-none tracking-tighter">
              Le changement <br />
              <span className="text-primary italic">commence ici.</span>
            </h2>
            <p className="text-xl md:text-2xl text-background/60 max-w-2xl mx-auto font-medium leading-relaxed">
              Chaque seconde passée est une opportunité d'agir. Rejoignez notre mouvement pour une transparence radicale et un impact humanitaire massif.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
              <Link
                to="/actualites"
                className="w-full sm:w-auto px-16 py-6 bg-primary text-white font-black text-lg uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30"
              >
                Faire un Don
              </Link>
              <button className="flex items-center gap-4 text-background font-black uppercase text-xs tracking-[0.3em] hover:text-primary transition-colors">
                <HelpingHand size={24} /> DEVENIR BÉNÉVOLE
              </button>
            </div>
            
            <div className="pt-20 border-t border-background/10 flex flex-wrap justify-center gap-12 text-background/40 font-black text-[10px] uppercase tracking-[0.3em]">
              <span className="flex items-center gap-2"><MessageSquare size={14} /> SUPPORT 24/7</span>
              <span className="flex items-center gap-2"><Globe size={14} /> IMPACT MONDIAL</span>
              <span className="flex items-center gap-2"><Activity size={14} /> SUIVI LIVE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Padding space to handle the overlapping footer CTA */}
      <div className="h-40 md:h-60" />
    </div>
  );
};

export default Home;
