import { motion } from 'framer-motion';
import { ShieldCheck, Droplets, Target, HelpingHand, Stethoscope, ChevronRight, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const CombatCard = ({ title, summary, points, icon: Icon, image, delay }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="group relative h-[450px] md:h-[500px] overflow-hidden rounded-[30px] md:rounded-[40px] bg-foreground flex flex-col justify-end p-6 md:p-12 hover:shadow-2xl transition-all border border-white/10"
    >
      {/* Visual background */}
      {image ? (
          <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-90 grayscale-[30%] group-hover:grayscale-0" />
      ) : (
          <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity z-0 bg-primary/20" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

      <div className="relative z-20 space-y-4 md:space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-primary/30 group-hover:bg-primary group-hover:border-transparent transition-all">
            <Icon size={20} className="text-primary group-hover:text-white transition-colors" />
          </div>
          <h4 className="text-xl md:text-2xl font-black text-white italic">{title}</h4>
        </div>
        
        <p className="text-sm md:text-base text-white/80 line-clamp-3 md:line-clamp-none font-medium leading-relaxed">
          {summary}
        </p>

        <ul className="hidden md:block space-y-2">
            {points.slice(0, 3).map((point: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-xs font-bold text-white/60">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    {point}
                </li>
            ))}
        </ul>

        <Link 
          to="/nos-combats" 
          className="inline-flex items-center gap-2 text-primary font-black uppercase text-[10px] md:text-xs tracking-widest group/btn"
        >
          Découvrir <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

const OurCombats = () => {
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
          "Justice sociale",
          "Sensibilisation & éducation",
          "Coopération renforcée"
      ]
    },
    {
      title: "Entrepreneuriat",
      icon: Target,
      image: "/assets/entrepreneuriat_mission_1773214144299.png",
      summary: "L'entreprenariat dans les villages ou quartiers permet de créer des emplois, soutenir l'économie locale et améliorer les conditions de vie tout en développant l'esprit d'initiative.",
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
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl space-y-4">
                <h2 className="text-primary font-bold tracking-[0.2em] text-xs uppercase">NOS COMBATS</h2>
                <h3 className="text-5xl md:text-7xl font-black text-foreground leading-none">
                    Pour un impact <br />
                    <span className="text-secondary italic">réel & durable.</span>
                </h3>
            </div>
            <p className="max-w-md text-foreground-muted text-lg leading-relaxed border-l-4 border-primary pl-6">
                Comment lutter de manière efficace ? En s'attaquant aux causes profondes des inégalités et en mettant les communautés au cœur de chaque action.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {combats.map((combat, index) => (
            <div key={index} className={index === 0 || index === 3 ? "md:col-span-2 lg:col-span-1" : ""}>
                <CombatCard 
                    {...combat} 
                    delay={index * 0.1}
                />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurCombats;
