import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

  return (
    <footer className="bg-muted border-t border-border pt-20 pb-10 mt-auto transition-colors duration-300">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
             <Link to="/" className="flex items-center gap-2 group">
              <img src="/logo.svg" alt="MM Universal" className="w-8 h-8 rounded-lg shadow-lg shadow-accent/20" />
              <span className="font-display font-bold text-lg tracking-tight text-foreground">
                Universal
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-background hover:bg-accent/10 flex items-center justify-center text-muted-foreground hover:text-accent transition-all duration-300 border border-border hover:border-accent/20 shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-6">{t('footer.company')}</h4>
            <ul className="space-y-4">
              {[
                { name: t('footer.aboutUs'), path: '/about' },
                { name: t('footer.services'), path: '/services' },
                { name: t('navbar.portfolio'), path: '/portfolio' },
                { name: t('footer.careers'), path: '/careers' },
                { name: t('footer.getInTouch'), path: '/contact' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-muted-foreground hover:text-accent transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/50 group-hover:bg-accent transition-colors"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-6">{t('footer.services')}</h4>
            <ul className="space-y-4">
              {[
                  { name: t('services.webDevelopment'), path: '/web-sale' },
                  { name: t('services.uiUxDesign'), path: '/services/design' },
                  { name: t('services.digitalMarketing'), path: '/services/marketing' },
                  { name: t('services.seoGrowth'), path: '/services/seo' },
                  { name: t('services.ecommerce'), path: '/services/ecommerce' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-muted-foreground hover:text-accent transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/50 group-hover:bg-accent transition-colors"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-6">{t('footer.getInTouch')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t('footer.emailUs')}</p>
                  <a href="mailto:hello@mmuniversal.com" className="text-foreground hover:text-accent transition-colors text-sm font-medium">
                    hello@mmuniversal.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent">
                  <MapPin className="w-4 h-4" />
                </div>
                 <div>
                  <p className="text-xs text-muted-foreground mb-1">{t('footer.visitUs')}</p>
                  <p className="text-muted-foreground text-sm">
                    123 Business Avenue, Tech District<br />New York, NY 10001
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} MM Universal. {t('footer.rightsReserved')}
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">{t('footer.privacyPolicy')}</Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground text-sm transition-colors">{t('footer.termsOfService')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
