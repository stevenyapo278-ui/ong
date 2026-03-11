import { motion } from 'framer-motion';
import { ShieldCheck, Scale, Phone, Mail, Globe } from 'lucide-react';

const LegalNotice = () => {
  const sections = [
    {
      title: "1. Présentation de l'organisation",
      icon: ShieldCheck,
      content: (
        <div className="space-y-4 text-foreground-muted leading-relaxed">
          <p>
            Le site web <span className="font-bold text-foreground">ongbienvivreici.org</span> est la propriété exclusive de l'ONG <span className="font-bold text-foreground">BIEN VIVRE ICI</span>.
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li><span className="font-bold text-foreground">Statut Juridique :</span> Organisation non gouvernementale à but non lucratif (Loi 1901)</li>
            <li><span className="font-bold text-foreground">Siège Social :</span> II Plateaux 7ème Tranche derrière le 22ème arrondissement de Cocody, Abidjan, Côte d'Ivoire.</li>
            <li><span className="font-bold text-foreground">Boîte Postale :</span> BP 712 Cidex 3 Abidjan Riviera</li>
          </ul>
        </div>
      )
    },
    {
      title: "2. Responsable de la publication",
      icon: Scale,
      content: (
        <div className="space-y-4 text-foreground-muted leading-relaxed">
          <p>
            Le responsable de la publication est la Direction de l'ONG Bien Vivre Ici. Pour toute question concernant le contenu du site, vous pouvez nous contacter :
          </p>
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-primary" />
              <span>contact@ongbienvivreici.org</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-primary" />
              <span>+225 0707824784</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "3. Hébergement",
      icon: Globe,
      content: (
        <div className="space-y-4 text-foreground-muted leading-relaxed">
          <p>
            Ce site est hébergé par des services cloud sécurisés permettant une accessibilité mondiale 24h/24 et 7j/7. 
            L'infrastructure technique est conçue pour garantir la protection des données et la rapidité de navigation.
          </p>
        </div>
      )
    },
    {
      title: "4. Propriété intellectuelle",
      icon: ShieldCheck,
      content: (
        <div className="space-y-4 text-foreground-muted leading-relaxed">
          <p>
            L'ensemble des contenus (textes, images, vidéos, logos) présents sur ce site est protégé par le droit d'auteur. 
            Toute reproduction, distribution ou modification de ces éléments sans autorisation préalable écrite de l'ONG Bien Vivre Ici est strictement interdite.
          </p>
        </div>
      )
    },
    {
        title: "5. Protection des données personnelles",
        icon: ShieldCheck,
        content: (
          <div className="space-y-4 text-foreground-muted leading-relaxed">
            <p>
              Conformément à la législation en vigueur sur la protection des données à caractère personnel, l'ONG Bien Vivre Ici s'engage à préserver la confidentialité des informations fournies en ligne par l'internaute.
            </p>
            <p>
                Vos données sont collectées uniquement à des fins de communication (Newsletter, Dons) et ne sont jamais cédées à des tiers.
            </p>
          </div>
        )
      }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <section className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-black uppercase text-[10px] tracking-widest">
            Documents Officiels
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-foreground italic leading-none">
            Mentions <span className="text-primary">Légales</span>
          </h1>
          <div className="h-1 w-20 bg-secondary rounded-full mx-auto" />
        </motion.div>

        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 md:p-12 bg-background-alt rounded-[40px] border border-border shadow-2xl shadow-black/5"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <section.icon size={24} />
                </div>
                <h2 className="text-2xl font-black text-foreground">{section.title}</h2>
              </div>
              {section.content}
            </motion.div>
          ))}
        </div>

        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-20 text-center text-foreground-muted text-sm font-medium"
        >
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </motion.div>
      </section>
    </div>
  );
};

export default LegalNotice;
