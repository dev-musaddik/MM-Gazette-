import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminBlogList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const res = await fetch('/api/articles');
            const data = await res.json();
            if (data.success) {
                setArticles(data.data);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch articles");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this article?")) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await fetch(`/api/articles/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`
                }
            });
            
            if (res.ok) {
                toast.success("Article deleted successfully");
                setArticles(articles.filter(a => a._id !== id));
            } else {
                toast.error("Failed to delete article");
            }
        } catch (err) {
            toast.error("Error deleting article");
        }
    };

    const filteredArticles = articles.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-display">Blog Posts</h1>
                        <p className="text-slate-400">Manage your blog articles and content.</p>
                    </div>
                    <Link to="/admin/blog/new" className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Create New Post
                    </Link>
                </div>

                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search articles..." 
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-accent text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : (
                    <div className="glass-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="p-4 font-bold text-slate-300">Title</th>
                                        <th className="p-4 font-bold text-slate-300">Category</th>
                                        <th className="p-4 font-bold text-slate-300">Author</th>
                                        <th className="p-4 font-bold text-slate-300">Created At</th>
                                        <th className="p-4 font-bold text-slate-300 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredArticles.map((article) => (
                                        <tr key={article._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-medium max-w-xs truncate">{article.title}</td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 bg-white/10 rounded text-xs">{article.category}</span>
                                            </td>
                                            <td className="p-4 text-slate-400">{article.author}</td>
                                            <td className="p-4 text-slate-400">{new Date(article.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link to={`/blog/${article.slug}`} target="_blank" className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors" title="View">
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link to={`/admin/blog/edit/${article._id}`} className="p-2 hover:bg-white/10 rounded-lg text-yellow-400 transition-colors" title="Edit">
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button onClick={() => handleDelete(article._id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredArticles.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-slate-400">No articles found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminBlogList;
