import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const Seo = ({ 
  title = "MM Universal | Digital Agency", 
  description = "Premium website design, development, and digital marketing services to grow your business.",
  keywords = "web development, digital agency, seo, react developer, ui/ux design",
  image = "/og-image.jpg", // Default OG image (ensure this exists in public folder later)
  type = "website",
  date,
  schema = null,
  canonical = null
}) => {
  const location = useLocation();
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://www.mm-universal.com/"; 
  const currentUrl = `${siteUrl}${location.pathname}`;
  const effectiveCanonical = canonical || currentUrl;

  // Structured Data (JSON-LD) for Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MM Universal",
    "url": siteUrl, // This will now use the correct URL
    "logo": `${siteUrl}logo.png`,
    "description": description,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567", // Replace with actual
      "contactType": "customer service"
    },
    "sameAs": [
      "https://facebook.com/mmuniversal",
      "https://twitter.com/mmuniversal",
      "https://linkedin.com/company/mmuniversal"
    ]
  };

  const finalSchema = schema ? { ...organizationSchema, ...schema } : organizationSchema;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={effectiveCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={effectiveCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${image}`} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={effectiveCanonical} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${siteUrl}${image}`} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>

      {date && <meta property="article:published_time" content={date} />}
    </Helmet>
  );
};

export default Seo;
