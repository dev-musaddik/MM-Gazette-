import { useLanguage } from '../../i18n/LanguageContext';

/**
 * Language Switcher Component
 * Toggle between Bangla and English
 */
const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border-2 border-primary-300 rounded-lg hover:bg-primary-50 hover:border-primary-500 transition-all duration-300 group"
      title={language === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
    >
      <span className="text-2xl">{language === 'bn' ? '🇧🇩' : '🇬🇧'}</span>
      <span className="font-sans font-semibold text-charcoal group-hover:text-primary-600 transition-colors">
        {language === 'bn' ? 'বাং' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
