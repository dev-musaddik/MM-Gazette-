import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, ArrowRight, ShieldCheck, Zap, Star, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Head from '../components/layout/Seo';
import { useTheme } from '../context/ThemeContext';
import LeadForm from '../components/landing/LeadForm';
import LandingCheckout from '../components/landing/LandingCheckout';
import ReviewsSection from '../components/landing/ReviewsSection';

import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

const DynamicLandingPage = () => {
    const { slug } = useParams();
    const { setTheme } = useTheme(); 
    const { t, i18n } = useTranslation();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const actionSectionRef = useRef(null);

    // Enforce Light Mode and Default Language (Bangla) on Mount
    useEffect(() => {
        setTheme('light');
        const originalLang = i18n.language; // Store original language
        
        // If user hasn't actively switched, or just force for this page type as requested
        if (originalLang !== 'bn') {
             i18n.changeLanguage('bn');
        }

        return () => {
            // Optional: Restore original language on unmount if desired
            // i18n.changeLanguage(originalLang); 
        };
    }, [setTheme, i18n]);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await fetch(`/api/landing-pages/slug/${slug}`);
                const data = await res.json();
                if (res.ok) {
                    setPage(data.data || data.landingPage);
                } else {
                    setError(true);
                }
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [slug]);

    const scrollToCTA = () => {
        if (actionSectionRef.current) {
            actionSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        } else if (page?.ctaLink) {
             window.location.href = page.ctaLink;
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    
    if (error || !page) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 text-center">
            <h1 className="text-4xl font-bold mb-4">{t('landingPage.offerNotFound')}</h1>
            <p className="text-muted-foreground mb-8">{t('landingPage.offerExpired')}</p>
            <Link to="/" className="btn-primary px-8 py-3 rounded-full">{t('landingPage.returnHome')}</Link>
        </div>
    );

    // Map string icon names to Lucide components
    const IconMap = {
        'Star': Star,
        'Shield': ShieldCheck,
        'Zap': Zap,
        'Check': Check
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white">
            <Head 
                title={`${page.title} | Special Offer`}
                description={page.heroSubheadline}
                schema={{
                    "@type": "Product", 
                    "name": page.title,
                    "description": page.heroSubheadline,
                    "image": page.heroImage
                }}
            >
                 {page.trackingCode && (
                    <script>{page.trackingCode}</script>
                )}
            </Head>

            {/* Navbar (Minimal) */}
            <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="container-custom py-4 flex justify-between items-center">
                    <Link to="/" className="text-xl font-display font-bold text-foreground tracking-tighter">
                        MM <span className="text-accent">Universal</span>
                    </Link>
                    
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <button onClick={scrollToCTA} className="md:hidden bg-accent text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                            {page.ctaText}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] -z-10" />
                
                <div className="container-custom grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                         <div className="inline-block px-4 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-6">
                            {t('landingPage.limitedTimeOffer')}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 text-foreground break-words">
                            {page.heroHeadline || page.title}
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                            {page.heroSubheadline}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={scrollToCTA}
                                className="btn-primary text-lg px-8 py-4 shadow-xl shadow-accent/25 flex items-center justify-center gap-2 group"
                            >
                                {page.ctaText} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-4">
                                <ShieldCheck className="w-5 h-5 text-green-500" /> {t('landingPage.dayGuarantee')}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative w-full max-w-lg mx-auto lg:max-w-none"
                    >
                        <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl shadow-slate-200/50 aspect-[4/3] bg-muted">
                            {page.heroImage ? (
                                <img 
                                    src={page.heroImage} 
                                    alt={page.title} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none'; 
                                        e.target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'text-muted-foreground');
                                        e.target.parentElement.innerText = t('landingPage.imageNotAvailable');
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/30">
                                    <span className="text-4xl font-display font-bold text-accent/20">MM</span>
                                </div>
                            )}
                             <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Features Grid */}
            <section className="py-20 bg-secondary/30 border-y border-border">
                <div className="container-custom">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">{t('landingPage.everythingYouNeed')}</h2>
                        <p className="text-muted-foreground">{t('landingPage.scaleFaster')}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {page.features.map((feature, index) => {
                            const Icon = IconMap[feature.icon] || Star;
                            return (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-8 rounded-3xl bg-background border border-border hover:border-accent/40 hover:shadow-lg transition-all group"
                                >
                                    <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-6 text-foreground group-hover:bg-accent group-hover:text-white transition-colors">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

             {/* Action Section (Lead Form or CTA) */}
            <section ref={actionSectionRef} className="py-24 relative bg-background">
                <div className="absolute inset-0 bg-accent/5 -z-10" />
                <div className="container-custom relative z-10">
                    
                    {/* Social Proof: Organic Reviews */}
                    <ReviewsSection landingPageId={page._id} />

                    {/* Unified View: Checkout + Contact */}
                    <div className="space-y-24">
                        
                        {/* 1. Primary Checkout Section */}
                        <div className="w-full">
                            <div className="text-center max-w-3xl mx-auto mb-12">
                                <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-foreground">
                                    {page.ctaText || t('landingPage.secureYourOrder')}
                                </h2>
                                <p className="text-lg text-muted-foreground">
                                    {page.type === 'lead' ? t('landingPage.enterDetails') : t('landingPage.completePurchase')}
                                </p>
                            </div>

                            <LandingCheckout 
                                product={page.product ? {
                                    ...page.product,
                                    basePrice: (page.price && page.price > 0) ? page.price : 
                                               (page.product.basePrice || page.product.price || 
                                               (parseInt((page.ctaText?.match(/\$(\d+)/) || [])[1]) || 0)),
                                               
                                    price: (page.price && page.price > 0) ? page.price : 
                                           (page.product.basePrice || page.product.price || 
                                           (parseInt((page.ctaText?.match(/\$(\d+)/) || [])[1]) || 0))
                                } : { 
                                    name: page.title, 
                                    price: page.price || (parseInt((page.ctaText?.match(/\$(\d+)/) || [])[1]) || 0), 
                                    image: page.heroImage,
                                    _id: page.productId 
                                }} 
                                landingPageId={page._id}
                            />
                        </div>

                        {/* 2. Secondary Contact/Lead Section */}
                        <div className="pt-16 border-t border-border">
                            <div className="text-center max-w-2xl mx-auto mb-12">
                                <h3 className="text-2xl font-bold mb-4 text-foreground">{t('landingPage.stillHaveQuestions')}</h3>
                                <p className="text-muted-foreground">
                                    {t('landingPage.notReadyToBuy')}
                                </p>
                            </div>
                            
                            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h4 className="text-xl font-bold mb-4 text-foreground">{t('landingPage.whyChooseUs')}</h4>
                                    <ul className="space-y-4 mb-8">
                                        {[
                                            t('landingPage.instantAccess'),
                                            t('landingPage.expertSupport'), 
                                            t('landingPage.securePayment'),
                                            t('landingPage.moneyBack')
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                                                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <LeadForm landingPageId={page._id} title={t('landingPage.askSpecialist')} subtitle={t('landingPage.replyTime')} />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <footer className="py-12 border-t border-border text-center text-muted-foreground text-sm bg-background">
                <p>&copy; {new Date().getFullYear()} MM Universal. {t('footer.rightsReserved')}</p>
            </footer>
        </div>
    );
};

export default DynamicLandingPage;
