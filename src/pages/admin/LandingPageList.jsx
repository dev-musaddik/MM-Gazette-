import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, ExternalLink, MoreVertical } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { toast } from 'react-hot-toast';

const LandingPageList = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const res = await fetch('/api/landing-pages/admin/all', {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setPages(data.landingPages || []);
            } else {
                toast.error('Failed to fetch landing pages');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error loading pages');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this landing page?')) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await fetch(`/api/landing-pages/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            });

            if (res.ok) {
                setPages(pages.filter(p => p._id !== id));
                toast.success('Landing page deleted');
            } else {
                toast.error('Failed to delete');
            }
        } catch (err) {
            toast.error('Error deleting page');
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">Landing Pages</h1>
                    <p className="text-muted-foreground mt-1">Manage dynamic ad landing pages</p>
                </div>
                <Link to="/admin/landing-pages/new" className="btn-primary flex items-center gap-2 px-4 py-2">
                    <Plus className="w-4 h-4" /> Create New Page
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">Loading...</div>
                ) : pages.length === 0 ? (
                    <div className="col-span-full text-center py-12 border border-dashed border-border rounded-xl">
                        <p className="text-muted-foreground mb-4">No landing pages found.</p>
                        <Link to="/admin/landing-pages/new" className="text-accent hover:underline">Create your first one</Link>
                    </div>
                ) : (
                    pages.map((page) => (
                        <div key={page._id} className="glass-card group relative overflow-hidden flex flex-col h-full">
                            <div className="h-40 overflow-hidden relative bg-muted">
                                <img 
                                    src={page.heroImage || 'https://via.placeholder.com/400x200'} 
                                    alt={page.title} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                     <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${page.isActive ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                                        {page.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                        page.type === 'sales' ? 'bg-purple-500/90 text-white' : 
                                        page.type === 'lead' ? 'bg-blue-500/90 text-white' : 
                                        'bg-slate-500/90 text-white'
                                    }`}>
                                        {page.type || 'Link'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold mb-1 truncate" title={page.title}>{page.title}</h3>
                                <p className="text-xs text-muted-foreground mb-4 font-mono truncate">/lp/{page.slug}</p>
                                
                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                                    <Link to={`/lp/${page.slug}`} target="_blank" className="text-xs flex items-center gap-1 text-muted-foreground hover:text-accent transition-colors">
                                        <ExternalLink className="w-3 h-3" /> View Live
                                    </Link>
                                    
                                    <div className="flex bg-muted/50 rounded-lg p-1">
                                        <Link to={`/admin/landing-pages/edit/${page._id}`} className="p-2 hover:bg-background rounded-md text-foreground transition-colors" title="Edit">
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button onClick={() => handleDelete(page._id)} className="p-2 hover:bg-background rounded-md text-red-500 transition-colors" title="Delete">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AdminLayout>
    );
};

export default LandingPageList;
