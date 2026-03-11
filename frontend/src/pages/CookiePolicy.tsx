import { motion } from 'framer-motion';
import { ShieldCheck, Cookie, Info, Settings, MousePointer2 } from 'lucide-react';

const CookiePolicy = () => {
  const sections = [
    {
      title: "1. Qu'est-ce qu'un cookie ?",
      icon: Cookie,
      content: (
        <div className="space-y-4 text-foreground-muted leading-relaxed">
          <p>
            Un cookie est un petit fichier texte déposé sur votre ordinateur lors de la visite d'un site. 
            Il a pour but de collecter des informations relatives à votre navigation et de vous adresser des services adaptés à votre terminal.
          </p>
        </div>
      )
    },
    {
      title: "2. Pourquoi utilisons-nous des cookies ?",
      icon: Info,
      content: (
        <div className="space-y-4 text-foreground-muted leading-relaxed">
          <p>
            Sur <span className="font-bold text-foreground italic">ongbienvivreici.org</span>, nous utilisons les cookies suivants :
          </p>
          <ul className="space-y-3 list-none pl-0">
            <li className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/20 shrink-0 mt-1 flex items-center justify-center text-primary text-[10px] font-black">01</div>
              <div><span className="font-black text-foreground uppercase text-[11px] tracking-widest">Cookies Techniques :</span> Indispensables au bon fonctionnement du site et de votre espace sécurisé.</div>
            </li>
            <li className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/20 shrink-0 mt-1 flex items-center justify-center text-primary text-[10px] font-black">02</div>
              <div><span className="font-black text-foreground uppercase text-[11px] tracking-widest">Cookies de Mesure d'audience :</span> Permettent de connaître le nombre de visites et d'analyser l'impact de nos appels aux dons.</div>
            </li>
            <li className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/20 shrink-0 mt-1 flex items-center justify-center text-primary text-[10px] font-black">03</div>
              <div><span className="font-black text-foreground uppercase text-[11px] tracking-widest">Cookies de Réseaux Sociaux :</span> Facilitent le partage de nos récits d'impact sur vos plateformes favorites.</div>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "3. Vos droits et choix",
      icon: Settings,
      content: (
        <div className="space-y-4 text-foreground-muted leading-relaxed">
          <p>
            Vous pouvez à tout moment choisir de désactiver ces cookies. Votre navigateur peut également être paramétré pour vous signaler les cookies qui sont déposés dans votre ordinateur et vous demander de les accepter ou pas.
          </p>
          <p>
              Veuillez noter que si vous refusez les cookies, votre expérience sur notre site pourrait être limitée (notamment l'accès à votre espace donateur).
          </p>
        </div>
      )
    },
    {
      title: "4. Durée de conservation",
      icon: ShieldCheck,
      content: (
        <div className="space-y-4 text-foreground-muted leading-relaxed">
          <p>
            Les cookies déposés par l'ONG Bien Vivre Ici ont une durée de vie limitée à 13 mois maximum, conformément aux recommandations de la CNIL et des autorités de protection des données locales.
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full text-secondary font-black uppercase text-[10px] tracking-widest">
            Vie Privée & Transparence
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-foreground italic leading-none">
            Politique <span className="text-secondary">Cookies</span>
          </h1>
          <div className="h-1 w-20 bg-primary rounded-full mx-auto" />
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 md:p-12 bg-background-alt rounded-[40px] border border-border shadow-2xl shadow-black/5 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all transform group-hover:rotate-6">
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
            className="mt-20 p-8 border-2 border-dashed border-border rounded-[40px] text-center"
        >
            <div className="flex flex-col items-center gap-4">
                <MousePointer2 className="text-primary animate-bounce" size={32} />
                <p className="text-lg font-black text-foreground uppercase tracking-widest italic">
                    Paramétrer mes choix de navigation
                </p>
                <p className="text-sm text-foreground-muted font-medium max-w-sm">
                    Vous avez le contrôle total sur vos données d'impact.
                </p>
            </div>
        </motion.div>
      </section>
    </div>
  );
};

export default CookiePolicy;
