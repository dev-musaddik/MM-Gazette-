import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        basePrice: '',
        category: 'Website',
        brand: 'MM Universal', // Default brand
        image: '',
        features: '', // Will split by comma
        demoUrl: '',
        stock: 100 // Default stock for digital items
    });

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${id}`);
            const data = await res.json();
            if (res.ok) {
                const product = data.data || data.product || data;
                setFormData({
                    name: product.name || '',
                    description: product.description || '',
                    basePrice: product.basePrice || '',
                    category: product.category || 'Website',
                    image: product.image || (product.images && product.images[0]) || '',
                    features: product.features ? product.features.join(', ') : '',
                    demoUrl: product.demoUrl || '',
                    stock: product.stock || 100
                });
            } else {
                setError('Failed to fetch product details.');
            }
        } catch (err) {
            setError('Error loading product.');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const url = isEditMode ? `/api/products/${id}` : '/api/products';
            const method = isEditMode ? 'PUT' : 'POST';

            // Format features array
            const formattedData = {
                ...formData,
                basePrice: Number(formData.basePrice),
                stock: Number(formData.stock),
                features: formData.features.split(',').map(f => f.trim()).filter(f => f !== ''),
                 // Logic to handle images array if backend expects it
                images: formData.image ? [formData.image] : []
            };

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify(formattedData)
            });

            const data = await res.json();

            if (res.ok) {
                navigate('/admin/products');
            } else {
                setError(data.message || 'Operation failed');
            }
        } catch (err) {
            setError('Server connection error');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return (
            <AdminLayout>
                <div className="text-center p-10 text-slate-400">Loading product data...</div>
            </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/admin/products')} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-display font-bold">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
                    <p className="text-slate-400 mt-1">{isEditMode ? 'Update service details' : 'Create a new service package'}</p>
                </div>
            </div>

            <div className="max-w-3xl">
                <div className="glass-card p-8 border border-white/10">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Service Name</label>
                            <input 
                                required
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Business Starter"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all" 
                            />
                        </div>

                        <div className="space-y-2">
                             <label className="text-sm font-medium text-slate-300">Stock Quantity</label>
                             <input 
                                 type="number" 
                                 name="stock"
                                 value={formData.stock}
                                 onChange={handleChange}
                                 className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all" 
                             />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Price ($)</label>
                                <input 
                                    required
                                    type="number" 
                                    name="basePrice"
                                    value={formData.basePrice}
                                    onChange={handleChange}
                                    placeholder="499"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Category</label>
                                <select 
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                                >
                                    <option value="Website">Website</option>
                                    <option value="E-commerce">E-commerce</option>
                                    <option value="Enterprise">Enterprise</option>
                                    <option value="SEO">SEO</option>
                                    <option value="Design">Design</option>
                                    <option value="Ads">Ads Management</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Brand/Provider</label>
                                <input 
                                    type="text" 
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all" 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Description</label>
                            <textarea 
                                required
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Details about this service..."
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Features (Comma separated)</label>
                            <input 
                                type="text" 
                                name="features"
                                value={formData.features}
                                onChange={handleChange}
                                placeholder="5 Pages, Mobile Responsive, SEO Ready..."
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Image URL</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all" 
                                />
                            </div>
                             {formData.image && (
                                <div className="mt-2 w-full h-40 rounded-xl overflow-hidden border border-white/10 bg-black/20">
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Live Demo URL (Optional)</label>
                            <div className="flex gap-2">
                                <input 
                                    type="url" 
                                    name="demoUrl"
                                    value={formData.demoUrl}
                                    onChange={handleChange}
                                    placeholder="https://example.com"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all" 
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                             <button 
                                type="button"
                                onClick={() => navigate('/admin/products')}
                                className="px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="btn-primary flex items-center gap-2 shadow-lg shadow-accent/20 px-8 py-3"
                            >
                                {loading ? 'Saving...' : (
                                    <>
                                        <Save className="w-5 h-5" /> {isEditMode ? 'Update Product' : 'Create Product'}
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

export default ProductForm;
