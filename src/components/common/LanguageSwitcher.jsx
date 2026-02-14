import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    const currentLang = i18n.language === 'bn' ? 'বাংলা' : 'English';

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline-block font-medium">{currentLang}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 glass-card overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="py-1">
                        <button
                            onClick={() => changeLanguage('en')}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-accent/10 hover:text-accent transition-colors ${i18n.language === 'en' ? 'text-accent font-bold' : 'text-slate-300'}`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => changeLanguage('bn')}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-accent/10 hover:text-accent transition-colors ${i18n.language === 'bn' ? 'text-accent font-bold' : 'text-slate-300'}`}
                        >
                            বাংলা
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
