import { Link } from 'react-router-dom';
import { ArrowRight, Newspaper, Image as ImageIcon, ShieldCheck, Heart, Users, Globe, ChevronRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-16 md:space-y-24 pb-20">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[80vh] flex items-center pt-8 md:pt-20 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -z-10 w-[80%] md:w-[60%] h-full bg-background-alt/50 rounded-l-[40px] md:rounded-l-[100px] transform translate-x-20"></div>
        <div className="absolute top-40 left-10 -z-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-50 md:opacity-100"></div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] md:text-sm font-bold tracking-tight transition-colors">
              <Heart size={14} className="mr-2 fill-primary md:w-4 md:h-4" />
              ENSEMBLE POUR UN MONDE MEILLEUR
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-foreground leading-[1.1] transition-colors">
              Redonner <span className="text-primary">l'espoir</span> par des actions concrètes.
            </h1>
            <p className="text-lg md:text-xl text-foreground-muted max-w-xl leading-relaxed font-medium transition-colors">
              Découvrez l'impact de nos missions humanitaires à travers le monde. Nous partageons chaque étape de nos projets pour une transparence totale envers nos partenaires et donateurs.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                to="/actualites"
                className="group inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:shadow-primary/40 hover:-translate-y-1"
              >
                Explorer nos récits
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-background text-foreground border-2 border-border font-bold text-lg hover:border-primary hover:text-primary transition-all shadow-sm"
              >
                Espace contributeur
              </Link>
            </div>

            {/* Quick Stats Mini */}
            <div className="pt-8 border-t border-border grid grid-cols-3 gap-4 md:gap-8">
              <div>
                <p className="text-2xl md:text-3xl font-black text-primary">12K+</p>
                <p className="text-[10px] md:text-sm font-bold text-foreground-muted uppercase tracking-wider transition-colors">Bénéficiaires</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-black text-primary">45</p>
                <p className="text-[10px] md:text-sm font-bold text-foreground-muted uppercase tracking-wider transition-colors">Projets Actifs</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-black text-primary">22</p>
                <p className="text-[10px] md:text-sm font-bold text-foreground-muted uppercase tracking-wider transition-colors">Pays Touchés</p>
              </div>
            </div>
          </div>

          <div className="relative group animate-in fade-in slide-in-from-right duration-1000 mt-8 md:mt-0">
            <div className="relative z-10 w-full aspect-[4/5] rounded-[30px] md:rounded-[40px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] transition-transform duration-700 group-hover:scale-[1.02]">
              <img
                src="/assets/hero.png"
                alt="Humanitarian Mission"
                className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
              />
            </div>
            {/* Floating Info Card */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:-bottom-10 md:-left-10 z-20 bg-background p-5 md:p-6 rounded-3xl shadow-2xl border border-border w-[85%] sm:max-w-[240px] animate-bounce-slow transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100/20 rounded-full flex items-center justify-center text-green-600">
                  <ShieldCheck size={20} />
                </div>
                <p className="font-bold text-foreground text-sm">Action Vérifiée</p>
              </div>
              <p className="text-xs text-foreground-muted leading-relaxed font-medium transition-colors">
                Toutes nos missions font l'objet d'un rapport détaillé et transparent consultable en ligne.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Projects Section ── */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <h2 className="text-primary font-black tracking-[0.2em] text-xs md:text-sm uppercase">PROJETS PHARES</h2>
            <h3 className="text-3xl md:text-5xl font-black text-foreground leading-tight transition-colors">Nos interventions prioritaires.</h3>
          </div>
          <Link to="/actualites" className="text-primary font-bold flex items-center hover:underline group text-sm">
            Voir tout l'historique <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { img: '/assets/project1.png', tag: 'Eau & Hygiène', title: 'Accès à l\'eau potable pour 500 familles à Nairobi.', color: 'bg-blue-100 text-blue-700' },
            { img: '/assets/project2.png', tag: 'Santé', title: 'Clinique mobile : Soins d\'urgence dans les zones reculées.', color: 'bg-indigo-100 text-indigo-700' },
            { img: '/assets/project3.png', tag: 'Éducation', title: 'Construction d\'un centre numérique pour les jeunes.', color: 'bg-orange-100 text-orange-700' }
          ].map((proj, i) => (
            <div key={i} className={`group cursor-pointer ${i === 2 ? 'sm:col-span-2 md:col-span-1' : ''}`}>
              <div className="relative w-full aspect-[4/3] rounded-[30px] overflow-hidden mb-6 shadow-lg shadow-primary/5 transition-all">
                <img src={proj.img} alt={proj.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${proj.color} backdrop-blur-md opacity-90 shadow-sm border border-white/20`}>
                    {proj.tag}
                  </span>
                </div>
              </div>
              <h4 className="text-xl md:text-2xl font-black text-foreground group-hover:text-primary mb-3 transition-colors">{proj.title}</h4>
              <p className="text-foreground-muted font-medium leading-relaxed line-clamp-2 transition-colors text-sm">
                Un projet structurant visant à transformer durablement le quotidien des populations vulnérables par l'innovation et l'engagement.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Engagement Tools Section ── */}
      <section className="bg-foreground mx-4 md:mx-6 rounded-[30px] md:rounded-[50px] p-8 md:p-20 relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] -ml-36 -mb-36"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-3 mb-4 md:mb-8">
            <h2 className="text-primary-foreground/60 font-black tracking-[0.2em] text-xs uppercase mb-4 transition-colors">NOTRE ÉCOSYSTÈME</h2>
            <h3 className="text-3xl md:text-5xl font-black text-background leading-tight transition-colors">Une plateforme pensée pour l'impact.</h3>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="w-16 md:w-20 h-16 md:h-20 bg-background/10 rounded-[24px] md:rounded-[30px] flex items-center justify-center text-primary-foreground/80 border border-background/20 mx-auto transition-colors">
              <Newspaper size={28} />
            </div>
            <h4 className="text-xl md:text-2xl font-black text-background transition-colors">Récits Narratifs</h4>
            <p className="text-background/70 font-medium transition-colors text-sm md:text-base">Textes enrichis, mise en page en colonnes et typographie soignée pour captiver vos lecteurs.</p>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="w-16 md:w-20 h-16 md:h-20 bg-background/10 rounded-[24px] md:rounded-[30px] flex items-center justify-center text-blue-400 border border-background/20 mx-auto transition-colors">
              <ImageIcon size={28} />
            </div>
            <h4 className="text-xl md:text-2xl font-black text-background transition-colors">Multimédia Immersif</h4>
            <p className="text-background/70 font-medium transition-colors text-sm md:text-base">Gestion haute performance des galeries photos et vidéos pour une immersion totale sur le terrain.</p>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="w-16 md:w-20 h-16 md:h-20 bg-background/10 rounded-[24px] md:rounded-[30px] flex items-center justify-center text-green-400 border border-background/20 mx-auto transition-colors">
              <Users size={28} />
            </div>
            <h4 className="text-xl md:text-2xl font-black text-background transition-colors">Co-création</h4>
            <p className="text-background/70 font-medium transition-colors text-sm md:text-base">Plusieurs contributeurs (Admins, Rédacteurs) travaillent de concert pour faire vivre la plateforme.</p>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="max-w-4xl mx-auto px-6 text-center py-10">
        <div className="bg-gradient-to-br from-background-alt to-background rounded-[30px] md:rounded-[40px] p-8 md:p-12 border border-border relative transition-colors overflow-hidden">
          <Globe size={120} className="absolute -top-10 -right-10 text-primary/5 rotate-12" />
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-6 transition-colors">Prêt à partager votre impact ?</h2>
          <p className="text-base md:text-lg text-foreground-muted mb-10 max-w-2xl mx-auto leading-relaxed font-medium transition-colors">
            Rejoignez notre réseau de contributeurs et commencez à publier vos récits humanitaires dès aujourd'hui.
          </p>
          <Link
            to="/login"
            className="inline-block w-full sm:w-auto px-12 py-5 bg-foreground text-background font-bold rounded-2xl hover:opacity-90 transition-all shadow-2xl hover:scale-105 active:scale-95"
          >
            Accéder au Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
