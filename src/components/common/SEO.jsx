import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  author, 
  image, 
  type = 'website',
  publishedTime,
  modifiedTime
}) => {
  const { pathname } = useLocation();
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const currentUrl = `${siteUrl}${pathname}`;
  const defaultImage = `${siteUrl}/default-og-image.jpg`; // Ensure you have this image in public/
  
  const metaTitle = title ? `${title} | MM Gazette BD` : 'MM Gazette BD - Your Tech Source';
  const metaDescription = description || 'Latest tech news, gadget reviews, and exclusive ad offers.';
  const metaKeywords = Array.isArray(keywords) ? keywords.join(', ') : keywords;
  const metaImage = image || defaultImage;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      <meta name="author" content={author || 'MM Gazette Team'} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content="MM Gazette BD" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};

export default SEO;
