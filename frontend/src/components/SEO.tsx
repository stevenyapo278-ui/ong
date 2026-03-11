import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
}

const SEO = ({ 
  title, 
  description, 
  canonical, 
  ogType = 'website',
  ogImage = '/assets/og-image.png' 
}: SEOProps) => {
  const siteTitle = 'ONG Bien Vivre Ici - Côte d\'Ivoire';
  const fullTitle = `${title} | ${siteTitle}`;
  const url = 'https://ongbienvivreici.org'; // Replace with actual domain

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={`${url}${canonical}`} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${url}${ogImage}`} />
      <meta property="og:url" content={`${url}${canonical || ''}`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${url}${ogImage}`} />

      {/* Keywords - optional, but helpful for some internal tools */}
      <meta name="keywords" content="ONG, Côte d'Ivoire, Cocody, Aide Humanitaire, Développement Durable, Santé, Education, Solidarité" />
    </Helmet>
  );
};

export default SEO;
