import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, MoreHorizontal } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            // Controller returns { success: true, count: X, data: [...] }
            setProducts(data.data || []);
        } catch (err) {
            console.error("Failed to fetch products", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`
                }
            });

            if (res.ok) {
                setProducts(products.filter(p => p._id !== id));
            } else {
                alert('Failed to delete product');
            }
        } catch (err) {
            console.error("Error deleting product", err);
        }
    };

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold">Products</h1>
                    <p className="text-slate-400 mt-1">Manage your digital assets and services.</p>
                </div>
                <Link to="/admin/products/new" className="btn-primary flex items-center gap-2 shadow-lg shadow-accent/20">
                    <Plus className="w-4 h-4" /> Add Product
                </Link>
            </div>

            {/* Search and Filter */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                    />
                </div>
            </div>

            {/* Product Table */}
            <div className="glass-card overflow-hidden border border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="p-4 font-medium text-slate-400">Product</th>
                                <th className="p-4 font-medium text-slate-400">Category</th>
                                <th className="p-4 font-medium text-slate-400">Price</th>
                                <th className="p-4 font-medium text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="p-8 text-center text-slate-400">Loading products...</td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan="4" className="p-8 text-center text-slate-400">No products found.</td></tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-white/10 overflow-hidden">
                                                    {product.image || product.images?.[0] ? (
                                                        <img src={product.image || product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">No Img</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white">{product.name}</h4>
                                                    <p className="text-xs text-slate-400 truncate max-w-[200px]">{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-slate-300">
                                                {product.category || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-white">${product.basePrice}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/admin/products/${product._id}/edit`} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-accent transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ProductList;
