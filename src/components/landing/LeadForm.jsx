import { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const LeadForm = ({ landingPageId, title, subtitle }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Use props if provided, otherwise fallback to translation
    const displayTitle = title || t('leadForm.titleDefault');
    const displaySubtitle = subtitle || t('leadForm.subtitleDefault');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/landing-pages/${landingPageId}/lead`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || t('leadForm.somethingWrong'));

            setSuccess(true);
            toast.success(t('leadForm.successMessage'));
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full max-w-md mx-auto bg-green-50/50 border border-green-200 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('leadForm.thankYou')}</h3>
                <p className="text-slate-600 mb-6">
                    {t('leadForm.receivedDetails')}
                </p>
                <button 
                    onClick={() => setSuccess(false)}
                    className="text-primary font-medium hover:underline text-sm"
                >
                    {t('leadForm.submitAnother')}
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{displayTitle}</h3>
                <p className="text-slate-500 text-sm">{displaySubtitle}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('leadForm.fullName')}</label>
                    <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
                        placeholder={t('leadForm.placeholderName')}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('leadForm.emailAddress')}</label>
                    <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
                        placeholder={t('leadForm.placeholderEmail')}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('leadForm.phoneNumber')}</label>
                    <input 
                        type="tel" 
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
                        placeholder={t('leadForm.placeholderPhone')}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('leadForm.message')}</label>
                    <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 resize-none"
                        placeholder={t('leadForm.placeholderMessage')}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full btn-primary py-3 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" /> {t('leadForm.submitting')}
                        </>
                    ) : (
                        <>
                            {t('leadForm.submitNow')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default LeadForm;
