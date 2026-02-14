import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const GoogleIntegration = () => {
    const [settings, setSettings] = useState({
        analyticsId: null,
        adsenseId: null
    });
    const location = useLocation();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data) {
                    setSettings({
                        analyticsId: data.google_analytics_id,
                        adsenseId: data.google_adsense_id
                    });
                }
            } catch (err) {
                console.error("Failed to load Google settings", err);
            }
        };
        fetchSettings();
    }, []);

    // Inject Google Analytics
    useEffect(() => {
        if (!settings.analyticsId) return;

        // Check if script already exists
        if (document.getElementById('google-analytics-script')) return;

        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${settings.analyticsId}`;
        script1.id = 'google-analytics-script'; // Tag ID to prevent duplicates
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${settings.analyticsId}');
        `;
        document.head.appendChild(script2);

    }, [settings.analyticsId]);

    // Track Page Views on Route Change
    useEffect(() => {
        if (!settings.analyticsId || !window.gtag) return;
        window.gtag('config', settings.analyticsId, {
            page_path: location.pathname + location.search
        });
    }, [location, settings.analyticsId]);

    // Inject Adsense
    useEffect(() => {
        if (!settings.adsenseId) return;

        if (document.querySelector(`script[src*="adsbygoogle"]`)) return;

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.adsenseId}`;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);

    }, [settings.adsenseId]);

    return null; // This component renders nothing visually
};

export default GoogleIntegration;
