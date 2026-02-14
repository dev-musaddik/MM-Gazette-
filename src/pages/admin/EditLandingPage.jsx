import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Trash } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { toast } from 'react-hot-toast';
import { optimizeImage } from '../../utils/imageOptimizer';

const EditLandingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        heroHeadline: '',
        heroSubheadline: '',
        heroImage: '',
        ctaText: 'Get Started',
        ctaLink: '/contact',
        features: [{ title: '', description: '', icon: 'Star' }],
        trackingCode: '',
        isActive: true,
        type: 'clickthrough', // 'lead', 'sales', 'clickthrough'
        price: 0,
        product: null
    });

    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (isEditMode) {
            fetchPageData();
        }
        fetchProducts();
    }, [id]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (res.ok) {
                setProducts(data.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch products');
        }
    };

    const fetchPageData = async () => {
        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await fetch(`/api/landing-pages/${id}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setFormData(data.landingPage);
            } else {
                toast.error('Failed to fetch page data');
                navigate('/admin/landing-pages');
            }
        } catch (err) {
            toast.error('Error loading page');
        } finally {
            setLoading(false);
        }
    };

    const handleProductSelect = (e) => {
        const productId = e.target.value;
        if (!productId) return;

        const product = products.find(p => p._id === productId);
        if (product) {
            setFormData(prev => ({
                ...prev,
                product: product._id,
                type: 'sales',
                price: product.basePrice || 0,
                title: (product.name || '') + ' Landing Page',
                heroHeadline: product.name || '',
                heroSubheadline: product.description || '',
                heroImage: product.image || (product.images && product.images[0]) || '',
                ctaText: `Buy Now - $${product.basePrice || 0}`,
                ctaLink: `/checkout?productId=${product._id}`, // Fallback link
            }));
            toast.success('Form populated from product!');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFeatureChange = (index, field, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index][field] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, { title: '', description: '', icon: 'Star' }]
        }));
    };

    const removeFeature = (index) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    // Simplified image upload using existing infrastructure or direct URL input for now
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const toastId = toast.loading('Optimizing and uploading...');

        try {
             // Optimize image before upload
             let fileToUpload = file;
             try {
                fileToUpload = await optimizeImage(file, 1920, 0.8);
                console.log('Image optimized:', file.size, '->', fileToUpload.size);
             } catch (optErr) {
                 console.warn("Optimization failed, using original file", optErr);
             }

            const formData = new FormData();
            formData.append('image', fileToUpload);

            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                setFormData(prev => ({ ...prev, heroImage: data.image || '' })); // Assuming backend returns { image: url }
                toast.success('Image uploaded successfully', { id: toastId });
            } else {
                toast.error('Upload failed: ' + (data.message || 'Unknown error'), { id: toastId });
            }
        } catch (err) {
            console.error(err);
            toast.error('Error uploading image', { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const url = isEditMode ? `/api/landing-pages/${id}` : '/api/landing-pages';
            const method = isEditMode ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(`Landing page ${isEditMode ? 'updated' : 'created'}!`);
                navigate('/admin/landing-pages');
            } else {
                toast.error(data.message || 'Operation failed');
            }
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/admin/landing-pages')} className="p-2 hover:bg-accent/10 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-3xl font-bold">{isEditMode ? 'Edit Landing Page' : 'Create New Landing Page'}</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 pb-20">
                     {/* Product Selector */}
                    <div className="glass-card p-6 border-accent/20 bg-accent/5">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-accent">Populate from Product (Optional)</h3>
                                <p className="text-sm text-slate-400">Select a product to auto-fill content.</p>
                            </div>
                        </div>
                        <select 
                            onChange={handleProductSelect} 
                            className="input-field w-full bg-background border border-border rounded-lg p-3 cursor-pointer"
                        >
                            <option value="">-- Select a Product to Auto-Fill --</option>
                            {products.map(p => (
                                <option key={p._id} value={p._id}>{p.name} (${p.basePrice})</option>
                            ))}
                        </select>
                    </div>

                    {/* General Settings */}
                    <div className="glass-card p-6 space-y-4">
                        <h3 className="text-xl font-bold mb-4">General Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Internal Title</label>
                                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="input-field w-full bg-background border border-border rounded-lg p-3" placeholder="e.g. Black Friday Sale" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">URL Slug</label>
                                <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="input-field w-full bg-background border border-border rounded-lg p-3" placeholder="auto-generated-if-empty" />
                                <p className="text-xs text-muted-foreground mt-1">/lp/{formData.slug || '...'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Page Type</label>
                                <select name="type" value={formData.type || 'clickthrough'} onChange={handleChange} className="input-field w-full bg-background border border-border rounded-lg p-3">
                                    <option value="clickthrough">Click-Through (Standard Link)</option>
                                    <option value="lead">Lead Capture (Contact Form)</option>
                                    <option value="sales">Sales Page (Embedded Checkout)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Price Override ($)</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} className="input-field w-full bg-background border border-border rounded-lg p-3" placeholder="0.00" />
                                <p className="text-xs text-muted-foreground mt-1">Set a price to use for the checkout form (overrides product price).</p>
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} id="isActive" className="w-5 h-5 accent-accent" />
                                <label htmlFor="isActive" className="cursor-pointer select-none">Make Publicly Active</label>
                            </div>
                        </div>
                    </div>

                    {/* Hero Section */}
                    <div className="glass-card p-6 space-y-4">
                        <h3 className="text-xl font-bold mb-4">Hero Section</h3>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-muted-foreground">Headline</label>
                            <input required type="text" name="heroHeadline" value={formData.heroHeadline} onChange={handleChange} className="input-field w-full bg-background border border-border rounded-lg p-3 text-lg font-bold" placeholder="e.g. 50% Off All Web Packages" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-muted-foreground">Subheadline</label>
                            <textarea required name="heroSubheadline" value={formData.heroSubheadline} onChange={handleChange} className="input-field w-full bg-background border border-border rounded-lg p-3 h-24" placeholder="Compelling subtext relating to your offer." />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                             <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Hero Image URL</label>
                                <div className="flex gap-2">
                                    <input required type="text" name="heroImage" value={formData.heroImage} onChange={handleChange} className="input-field flex-1 bg-background border border-border rounded-lg p-3" placeholder="https://..." />
                                     <label className="btn-secondary px-4 py-3 cursor-pointer flex items-center justify-center">
                                        <Upload className="w-4 h-4" />
                                        <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                    </label>
                                </div>
                                {uploading && <p className="text-xs text-accent mt-1">Uploading...</p>}
                            </div>
                            {formData.heroImage && (
                                <div className="rounded-lg overflow-hidden border border-border h-40 bg-muted">
                                    <img src={formData.heroImage} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CTA Settings */}
                     <div className="glass-card p-6 space-y-4">
                        <h3 className="text-xl font-bold mb-4">Call to Action</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Button Text</label>
                                <input required type="text" name="ctaText" value={formData.ctaText} onChange={handleChange} className="input-field w-full bg-background border border-border rounded-lg p-3" placeholder="Get Started" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Button Link</label>
                                <input required type="text" name="ctaLink" value={formData.ctaLink} onChange={handleChange} className="input-field w-full bg-background border border-border rounded-lg p-3" placeholder="/contact or #pricing" />
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="glass-card p-6 space-y-4">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="text-xl font-bold">Feature List</h3>
                             <button type="button" onClick={addFeature} className="text-xs btn-outline px-3 py-1">+ Add Feature</button>
                        </div>
                        
                        {formData.features.map((feature, index) => (
                            <div key={index} className="flex gap-4 items-start p-4 bg-background/50 rounded-xl border border-border">
                                <div className="flex-1 space-y-2">
                                    <input 
                                        type="text" 
                                        placeholder="Title (e.g. Fast Delivery)" 
                                        value={feature.title} 
                                        onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                                        className="w-full bg-background border border-border rounded p-2 text-sm font-bold"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Description" 
                                        value={feature.description} 
                                        onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                                        className="w-full bg-background border border-border rounded p-2 text-sm"
                                    />
                                </div>
                                <button type="button" onClick={() => removeFeature(index)} className="p-2 text-red-400 hover:bg-red-400/10 rounded">
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Tracking */}
                    <div className="glass-card p-6 space-y-4">
                        <h3 className="text-xl font-bold mb-4">Tracking & Analytics</h3>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-muted-foreground">Custom Scripts (Head)</label>
                            <textarea name="trackingCode" value={formData.trackingCode} onChange={handleChange} className="input-field w-full bg-background border border-border rounded-lg p-3 font-mono text-xs h-32" placeholder="<!-- Facebook Pixel Code --> ... " />
                            <p className="text-xs text-muted-foreground mt-2">Paste your tracking scripts here. They will be injected into the page head.</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 sticky bottom-8">
                         <button type="button" onClick={() => navigate('/admin/landing-pages')} className="btn-outline bg-background/80 backdrop-blur">Cancel</button>
                         <button disabled={loading} type="submit" className="btn-primary shadow-xl px-8 py-3 flex items-center gap-2">
                            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Page'}
                         </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default EditLandingPage;
