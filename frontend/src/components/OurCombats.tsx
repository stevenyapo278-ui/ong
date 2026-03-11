import { motion } from 'framer-motion';
import { ShieldCheck, Droplets, Target, HelpingHand, Stethoscope, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CombatCard = ({ title, summary, points, icon: Icon, delay }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="group relative h-[500px] overflow-hidden rounded-[40px] bg-foreground flex flex-col justify-end p-8 md:p-12 hover:shadow-2xl transition-all border border-white/10"
    >
      {/* Semi-transparent background pattern/gradient since images are skipped for now */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity z-0 bg-primary/20" />

      <div className="relative z-20 space-y-6">
        <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-bold text-white uppercase tracking-[0.2em]">
                FOCUS
            </div>
            <div className="text-secondary group-hover:scale-110 transition-transform">
                <Icon size={20} />
            </div>
        </div>

        <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">
          {title}
        </h3>

        <div className="space-y-4 max-h-0 opacity-0 group-hover:max-h-[300px] group-hover:opacity-100 transition-all duration-500 overflow-hidden">
            <p className="text-white/80 text-sm leading-relaxed italic">
                {summary}
            </p>
            <ul className="grid grid-cols-1 gap-2">
                {points.map((point: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-white/70 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                        {point}
                    </li>
                ))}
            </ul>
        </div>

        <Link to="/nos-combats" className="flex items-center gap-2 text-secondary font-bold uppercase text-[10px] tracking-widest pt-4 group/btn hover:text-primary transition-colors cursor-pointer">
            DÉCOUVRIR <ChevronRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
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
      summary: "Garantir un accès universel aux soins de santé et promouvoir des modes de vie sains au sein des communautés.",
      points: [
          "Prévention & sensibilisation",
          "Éducation sanitaire",
          "Amélioration du cadre de vie",
          "Accès universel aux soins",
          "Participation communautaire",
          "Promotion d'un mode de vie sain"
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
