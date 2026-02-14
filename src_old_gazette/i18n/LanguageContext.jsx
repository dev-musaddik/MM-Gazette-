import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { translations } from './translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const location = useLocation();
  const navigate = useNavigate();
  
  // Sync language with URL path
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const langSegment = pathSegments[1];
    
    if (langSegment === 'bn' || langSegment === 'en') {
      if (language !== langSegment) {
        setLanguage(langSegment);
        document.documentElement.lang = langSegment;
        localStorage.setItem('language', langSegment);
      }
    }
  }, [location.pathname, language]);

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  const toggleLanguage = () => {
    const newLang = language === 'bn' ? 'en' : 'bn';
    const currentPath = location.pathname;
    const pathSegments = currentPath.split('/');
    
    // Replace the language segment
    if (pathSegments[1] === 'bn' || pathSegments[1] === 'en') {
      pathSegments[1] = newLang;
    } else {
      pathSegments.splice(1, 0, newLang);
    }
    
    const newPath = pathSegments.join('/');
    navigate(newPath);
  };

  // Helper to generate localized paths
  const getLocalizedPath = (path) => {
    // If path already starts with /en or /bn, return as is (or handle if needed)
    if (path.startsWith('/en/') || path.startsWith('/bn/') || path === '/en' || path === '/bn') {
      return path;
    }
    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `/${language}${cleanPath === '/' ? '' : cleanPath}`;
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    getLocalizedPath,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
