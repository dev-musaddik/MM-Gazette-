import { useState, useEffect } from 'react';
import { Save, User, Lock, Mail } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminSettings = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const [googleSettings, setGoogleSettings] = useState({
        analyticsId: '',
        adsenseId: ''
    });
    const [settingsLoading, setSettingsLoading] = useState(false);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setFormData(prev => ({
                ...prev,
                name: userInfo.name || '',
                email: userInfo.email || ''
            }));
        }
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (data) {
                setGoogleSettings({
                    analyticsId: data.google_analytics_id || '',
                    adsenseId: data.google_adsense_id || ''
                });
            }
        } catch (err) {
            console.error("Failed to fetch settings", err);
        }
    };

    const handleSettingsSubmit = async (e) => {
        e.preventDefault();
        setSettingsLoading(true);
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        try {
            // Save Analytics ID
            if (googleSettings.analyticsId) {
                await fetch('/api/settings', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
                    body: JSON.stringify({ key: 'google_analytics_id', value: googleSettings.analyticsId, description: 'Google Analytics Measurement ID' })
                });
            }

            // Save AdSense ID
            if (googleSettings.adsenseId) {
                await fetch('/api/settings', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
                    body: JSON.stringify({ key: 'google_adsense_id', value: googleSettings.adsenseId, description: 'Google AdSense Publisher ID' })
                });
            }

            setMessage("Integration settings saved successfully");
        } catch (err) {
            setError("Failed to save settings");
        } finally {
            setSettingsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password || undefined
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Profile updated successfully");
                // Update local storage
                const updatedUser = { ...userInfo, name: data.name, email: data.email };
                if (data.token) updatedUser.token = data.token;
                localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                
                // Clear password fields
                setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
            } else {
                setError(data.message || "Failed to update profile");
            }
        } catch (err) {
            setError("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold">Settings</h1>
                    <p className="text-slate-400 mt-1">Manage your account preferences.</p>
                </div>
            </div>

            <div className="max-w-2xl">
                <div className="glass-card p-8 border border-white/10">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-accent" /> Profile Settings
                    </h3>

                    {message && (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl mb-6">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all" 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all" 
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-accent" /> Change Password
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">New Password</label>
                                    <input 
                                        type="password" 
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Leave blank to keep current"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm new password"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="btn-primary flex items-center gap-2 shadow-lg shadow-accent/20 px-8 py-3"
                            >
                                {loading ? 'Saving...' : (
                                    <>
                                        <Save className="w-5 h-5" /> Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="max-w-2xl mt-8">
                <div className="glass-card p-8 border border-white/10">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <div className="w-5 h-5 text-blue-500">
                             <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                        </div>
                        Google Integration
                    </h3>
                    <p className="text-sm text-slate-400 mb-6">Connect your site with Google Analytics and AdSense.</p>

                    <form onSubmit={handleSettingsSubmit} className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Google Analytics Measurement ID</label>
                            <input 
                                type="text" 
                                value={googleSettings.analyticsId}
                                onChange={(e) => setGoogleSettings({...googleSettings, analyticsId: e.target.value})}
                                placeholder="G-XXXXXXXXXX"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all" 
                            />
                            <p className="text-xs text-slate-500">Find this in Analytics > Admin > Data Streams.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Google AdSense Publisher ID</label>
                            <input 
                                type="text" 
                                value={googleSettings.adsenseId}
                                onChange={(e) => setGoogleSettings({...googleSettings, adsenseId: e.target.value})}
                                placeholder="pub-XXXXXXXXXXXXXXXX"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all" 
                            />
                            <p className="text-xs text-slate-500">Find this in AdSense > Account > Settings.</p>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={settingsLoading}
                                className="btn-outline flex items-center gap-2 px-8 py-3 w-full justify-center hover:bg-white/5"
                            >
                                {settingsLoading ? 'Saving Keys...' : (
                                    <>
                                        <Save className="w-5 h-5" /> Save API Keys
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
