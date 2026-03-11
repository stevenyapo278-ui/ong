import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Shield, 
  Heart,
  ChevronRight,
  Map,
  MessageCircle,
  Newspaper
} from 'lucide-react';

const SitemapSection = ({ title, icon: Icon, links }: { title: string, icon: any, links: { label: string, path: string }[] }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="space-y-6"
  >
    <div className="flex items-center gap-4 border-b border-border pb-4 transition-colors">
      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary transition-colors">
        <Icon size={24} />
      </div>
      <h2 className="text-xl font-black text-foreground uppercase tracking-widest italic">{title}</h2>
    </div>
    <ul className="space-y-4 pl-4">
      {links.map((link) => (
        <li key={link.path}>
          <Link 
            to={link.path}
            className="group flex items-center gap-3 text-foreground-muted hover:text-primary transition-all font-medium"
          >
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            <span>{link.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  </motion.div>
);

const Sitemap = () => {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-24 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.3em]"
          >
            <Map size={14} /> Navigation Globale
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black text-foreground tracking-tighter italic">
            Plan du <span className="text-primary">Site.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-foreground-muted text-lg font-medium leading-relaxed">
            Parcourez l'ensemble de notre plateforme et découvrez comment nous agissons pour le bien-être des communautés à Cocody.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          <SitemapSection 
            title="Principal"
            icon={Home}
            links={[
              { label: "Accueil", path: "/" },
              { label: "Nos Combats", path: "/nos-combats" },
              { label: "Faire un Don", path: "/espace-donateur" },
              { label: "Devenir Partenaire", path: "/espace-partenaires" }
            ]}
          />

          <SitemapSection 
            title="Journal & Impact"
            icon={Newspaper}
            links={[
              { label: "Blog Impact", path: "/blog" },
              { label: "Toutes les Actualités", path: "/actualites" },
              { label: "Vidéos de Mission", path: "/actualites?type=VIDEO" },
              { label: "Galerie Photos", path: "/actualites?type=IMAGE" }
            ]}
          />

          <SitemapSection 
            title="Légal & Infos"
            icon={Shield}
            links={[
              { label: "Mentions Légales", path: "/mentions-legales" },
              { label: "Politique Cookies", path: "/politique-cookies" },
              { label: "FAQ", path: "/#faq" },
              { label: "Contact", path: "/#contact" }
            ]}
          />

          <SitemapSection 
            title="Engagement"
            icon={Heart}
            links={[
              { label: "Devenir Bénévole", path: "/#newsletter" },
              { label: "Notre Newsletter", path: "/#newsletter" },
              { label: "Témoignages", path: "/#testimonies" }
            ]}
          />

          <SitemapSection 
            title="Réseaux"
            icon={MessageCircle}
            links={[
              { label: "Facebook", path: "https://facebook.com" },
              { label: "Instagram", path: "https://instagram.com" },
              { label: "LinkedIn", path: "https://linkedin.com" }
            ]}
          />
        </div>

        {/* Decorative background element */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-[0.03] pointer-events-none">
            <Map size={800} />
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
