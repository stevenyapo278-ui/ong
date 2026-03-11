import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-primary transition-colors focus:outline-none group"
      >
        <span className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-accent-blue ml-4 flex-shrink-0"
        >
          <ChevronDown size={24} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-foreground-muted leading-relaxed text-lg">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const faqData = [
    {
      question: "Comment mon don est-il utilisé ?",
      answer: "Votre don est directement alloué à nos programmes sur le terrain : santé communautaire, éducation, et projets de développement durable à Cocody et ses environs. Nous nous engageons à une transparence totale avec des rapports réguliers sur l'utilisation des fonds."
    },
    {
      question: "Comment puis-je être sûr que mon don est sécurisé ?",
      answer: "Nous utilisons des passerelles de paiement certifiées et hautement sécurisées. Vos informations bancaires sont cryptées et ne sont jamais stockées sur nos serveurs. Nous respectons les normes de sécurité les plus strictes pour garantir la protection de vos données."
    },
    {
      question: "Comment puis-je faire un don à ONG BIEN VIVRE ICI ?",
      answer: "Vous pouvez faire un don ponctuel directement sur notre site via la page 'Faire un Don'. Nous acceptons les cartes bancaires, les virements et les solutions de paiement mobile locales pour faciliter votre générosité."
    },
    {
      question: "Puis-je faire un don en nature ?",
      answer: "Oui, nous acceptons également les dons en nature (matériel scolaire, équipements médicaux, denrées non périssables). Pour organiser la logistique, veuillez nous contacter directement via notre formulaire ou par téléphone."
    },
    {
      question: "Des personnes m'ont approché pour me demander des dons pour ONG BIEN VIVRE ICI. Comment puis-je vérifier s'il s'agit de représentants légitimes ou de fraudeurs potentiels ?",
      answer: "Pour le moment, nous n'avons pas de dispositif de collecte de fonds hors ligne pour ONG BIEN VIVRE ICI. Vous pouvez soutenir nos efforts en faveur des enfants vulnérables en faisant un don en ligne sur cette page web.\n\nEn tant qu'organisation, nous ne contactons jamais des particuliers par le biais de messages personnels sur Facebook, Instagram ou d'autres canaux.\n\nVeuillez ne partager aucune information sensible/bancaire avec des personnes qui pourraient vous demander ce type d'informations, que ce soit en ligne ou hors ligne."
    },
    {
      question: "Vais-je recevoir un reçu pour mon don ?",
      answer: "Absolument. Un reçu fiscal vous est automatiquement envoyé par email après chaque don. Si vous avez créé un compte donateur, vous pouvez également retrouver et télécharger tous vos reçus dans votre espace personnel."
    },
    {
      question: "Puis-je parrainer un enfant spécifique dans la région ?",
      answer: "Nous privilégions le soutien communautaire global. Cette approche permet d'améliorer les conditions de vie de tous les enfants d'une zone (écoles, accès à l'eau, santé) plutôt que d'un seul individu, créant un impact plus équitable et durable."
    },
    {
      question: "Comment vous contacter pour plus d'informations ?",
      answer: "Notre équipe est à votre écoute. Vous pouvez nous joindre via le formulaire de contact sur ce site, par email à contact@ongbienvivreici.org, ou nous rendre visite à notre siège social situé à Cocody, Abidjan."
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-accent-blue uppercase tracking-tight mb-4">
            Vous avez des questions ? Nous avons les réponses :
          </h2>
          <div className="h-1 w-20 bg-secondary mx-auto rounded-full"></div>
        </div>

        <div className="space-y-2">
          {faqData.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
