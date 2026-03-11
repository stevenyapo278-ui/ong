import { motion } from 'framer-motion';
import { ShieldCheck, Droplets, Target, HelpingHand, Stethoscope, Heart, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const CombatDetail = ({ title, summary, points, icon: Icon, image, index }: any) => {
  const isEven = index % 2 === 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 md:gap-16 items-center py-16 md:py-24 border-b border-border last:border-0`}
    >
      <div className="flex-1 space-y-6 md:space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Icon size={28} className="md:w-8 md:h-8" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-foreground leading-tight italic">{title}</h2>
        </div>
        
        <p className="text-base md:text-xl text-foreground-muted leading-relaxed font-medium">
          {summary}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {points.map((point: string, idx: number) => (
            <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-background-alt border border-border group hover:border-primary/30 transition-colors">
              <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />
              <span className="text-sm font-bold text-foreground">{point}</span>
            </div>
          ))}
        </div>

        <Link
            to="/espace-donateur"
            className="inline-flex items-center justify-center gap-4 bg-foreground text-background px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl w-full sm:w-auto"
        >
            Soutenir ce combat
        </Link>
      </div>
      
      <div className="flex-1 w-full relative">
        <div className="relative aspect-[4/3] rounded-[30px] md:rounded-[40px] overflow-hidden group shadow-2xl border border-border/50">
            {image ? (
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
            ) : (
                <div className="w-full h-full bg-foreground flex items-center justify-center">
                    <Icon size={80} className="text-white/20 group-hover:scale-110 transition-transform duration-500" />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
            
            <div className="absolute bottom-6 left-6 right-6 p-4 md:p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <p className="text-white font-black text-[9px] md:text-xs uppercase tracking-widest">Impact sur le terrain</p>
                <p className="text-white/70 text-[8px] md:text-[10px] mt-1 uppercase tracking-widest">Cocody, Abidjan</p>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

const NosCombats = () => {
    const combats = [
        {
          title: "Culture de la Paix",
          icon: ShieldCheck,
          image: "/assets/culture_paix_mission_1773213865603.png",
          summary: "Promouvoir une harmonie sociale durable à travers l'éducation et le respect mutuel.",
          points: [
              "Le respect des droits humains",
              "La non-violence",
              "Le dialogue et la tolérance",
              "La justice et l'égalité",
              "La solidarité",
              "L'éducation à la paix"
          ]
        },
        {
          title: "Développement Durable",
          icon: Droplets,
          image: "/assets/developpement_durable_mission_1773213989000.png",
          summary: "Promouvoir le développement durable par la protection de l'environnement, l'utilisation responsable des ressources et une économie respectueuse de la nature.",
          points: [
              "Protection de l'environnement",
              "Utilisation responsable des ressources",
              "Économie circulaire & durable",
              "Promotion de la justice sociale",
              "Sensibilisation & éducation",
              "Renforcement de la coopération"
          ]
        },
        {
          title: "Entrepreneuriat",
          icon: Target,
          image: "/assets/entrepreneuriat_mission_1773214144299.png",
          summary: "L'entreprenariat dans les villages ou quartiers permet de créer des emplois, soutenir l'économie locale and améliorer les conditions de vie tout en développant l'esprit d'initiative.",
          points: [
              "Renforcement des capacités professionnelles des PME",
              "Assistance technique, conseil, Étude de faisabilité",
              "Organisation des MPE et des coopératives",
              "Aide à la collecte et diffusion d'informations",
              "Accès aux financements et fonds de garantie"
          ]
        },
        {
          title: "Lutte contre la Pauvreté",
          icon: HelpingHand,
          image: "/assets/lutte_pauvrete_mission_1773214244550.png",
          summary: "Lutter contre la précarité par l'éducation, l'employabilité et l'accès garanti aux services de base pour tous.",
          points: [
              "Amélioration de l'éducation",
              "Favorisation de l'emploi local",
              "Accès aux services de base",
              "Égalité & justice sociale",
              "Développement économique",
              "Protection sociale solidaire"
          ]
        },
        {
          title: "Santé Communautaire",
          icon: Stethoscope,
          image: "/assets/mission_sante.png",
          summary: "Garantir un accès universel aux soins de santé et promouvoir des modes de vie sains au sein des communautés.",
          points: [
              "Prévention & sensibilisation",
              "Éducation sanitaire",
              "Amélioration du cadre de vie",
              "Accès universel aux soins",
              "Participation communautaire",
              "Promotion d'un mode de vie sain"
          ]
        },
        {
          title: "Renforcement des Capacités",
          icon: GraduationCap,
          image: "/assets/mission_education.png",
          summary: "Renforcer les capacités de tous permet de développer l'autonomie, la solidarité et le progès communautaire, en donnant à chacun les moyens d'agir efficacement dans sa vie et son environnement.",
          points: [
              "L'éducation et la formation",
              "L'accès à l'information",
              "L'accompagnement et le mentorat",
              "La création de ressources",
              "L'inclusion et la participation",
              "La sensibilisation et la motivation"
          ]
        }
    ];

  return (
    <div className="bg-background pt-32 pb-24">
      <SEO 
        title="Nos Combats" 
        description="Découvrez les actions de l'ONG Bien Vivre Ici en Côte d'Ivoire : santé communautaire, éducation, paix, entrepreneuriat et lutte contre la pauvreté."
        canonical="/nos-combats"
      />
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-6"
        >
            <h1 className="text-5xl md:text-8xl font-black text-foreground leading-none">
                Nos <span className="text-primary">Combats</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-foreground-muted leading-relaxed">
                Découvrez comment nous agissons au quotidien pour transformer durablement les communautés en Côte d'Ivoire.
            </p>
            <div className="flex justify-center pt-4">
                <div className="h-1.5 w-24 bg-secondary rounded-full" />
            </div>
        </motion.div>
      </section>

      {/* Combats List */}
      <section className="max-w-7xl mx-auto px-6">
        {combats.map((combat, index) => (
            <CombatDetail key={index} {...combat} index={index} />
        ))}
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 mt-32">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="p-12 md:p-20 bg-primary rounded-[60px] text-center text-white space-y-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Heart size={200} />
          </div>
          <h2 className="text-4xl md:text-6xl font-black">Rejoignez le combat.</h2>
          <p className="text-xl text-white/80 max-w-xl mx-auto">
            Chaque geste compte. Votre soutien nous permet de continuer ces actions essentielles sur le terrain.
          </p>
          <div className="flex flex-wrap justify-center gap-6 pt-4 relative z-10">
            <Link to="/espace-donateur" className="px-10 py-5 bg-white text-primary font-black uppercase text-sm tracking-widest rounded-full hover:scale-105 transition-all">
                Faire un don
            </Link>
            <Link to="/actualites" className="px-10 py-5 bg-primary-dark text-white font-black uppercase text-sm tracking-widest rounded-full border border-white/20 hover:bg-white/10 transition-all">
                Nos actualités
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default NosCombats;
