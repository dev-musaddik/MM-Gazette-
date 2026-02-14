import { useState, useEffect } from 'react';
import { Loader2, Mail, Phone, Calendar, User, FileText } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { format } from 'date-fns';

const LandingPageLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const token = userInfo?.token;

                const res = await fetch('/api/landing-pages/leads/all', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                const data = await res.json();
                
                if (res.ok) {
                    setLeads(data.leads);
                } else {
                    setError(data.message || 'Failed to fetch leads');
                }
            } catch (err) {
                setError('Failed to connect to server');
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();
    }, []);

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-foreground">Landing Page Leads</h1>
                <p className="text-muted-foreground mt-2">Manage inquiries captured from your landing pages.</p>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                    {error}
                </div>
            ) : leads.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-2xl border border-border">
                    <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-foreground">No leads yet</h3>
                    <p className="text-muted-foreground">Share your landing pages to start collecting leads.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {leads.map((lead) => (
                        <div key={lead._id} className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground text-lg">{lead.name}</h3>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            {format(new Date(lead.createdAt), 'PPP p')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                     <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider">
                                        {lead.landingPage?.title || 'Unknown Source'}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                                        lead.status === 'new' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                        lead.status === 'contacted' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                                        'bg-green-50 text-green-600 border-green-200'
                                    }`}>
                                        {lead.status}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6 p-4 bg-secondary/30 rounded-lg">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-foreground">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <a href={`mailto:${lead.email}`} className="hover:text-primary transition-colors">{lead.email}</a>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-foreground">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <a href={`tel:${lead.phone}`} className="hover:text-primary transition-colors">{lead.phone}</a>
                                    </div>
                                </div>
                                {lead.message && (
                                    <div className="text-sm text-foreground border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-4">
                                        <div className="flex items-start gap-2">
                                            <FileText className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                                            <p>{lead.message}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
};

export default LandingPageLeads;
