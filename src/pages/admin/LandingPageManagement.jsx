import { useEffect, useState } from 'react';
import api from '../../redux/api/apiService';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { FiPlus, FiEdit, FiTrash2, FiExternalLink, FiCopy, FiEye } from 'react-icons/fi';

/**
 * Landing Page Management (Admin)
 * CRUD interface for Facebook ad landing pages
 */
const LandingPageManagement = () => {
  const [landingPages, setLandingPages] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    product: '',
    headline: '',
    subheadline: '',
    description: '',
    features: ['', '', ''],
    benefits: ['', '', ''],
    images: [],
    specialPrice: '',
    originalPrice: '',
    discount: '',
    urgencyText: '',
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pagesRes, productsRes] = await Promise.all([
        api.get('/api/landing-pages/admin/all'),
        api.get('/api/products'),
      ]);
      setLandingPages(pagesRes.data.landingPages);
      setProducts(productsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug,
      title: page.title,
      product: page.product._id,
      headline: page.headline,
      subheadline: page.subheadline || '',
      description: page.description,
      features: page.features?.length ? page.features : ['', '', ''],
      benefits: page.benefits?.length ? page.benefits : ['', '', ''],
      images: page.images || [],
      specialPrice: page.specialPrice || '',
      originalPrice: page.originalPrice || '',
      discount: page.discount || '',
      urgencyText: page.urgencyText || '',
      isActive: page.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this landing page?')) return;
    
    try {
      await api.delete(`/api/landing-pages/${id}`);
      setLandingPages(landingPages.filter(p => p._id !== id));
      alert('Landing page deleted successfully!');
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete landing page.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      features: formData.features.filter(f => f.trim()),
      benefits: formData.benefits.filter(b => b.trim()),
      specialPrice: formData.specialPrice ? parseFloat(formData.specialPrice) : null,
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      discount: formData.discount ? parseInt(formData.discount) : null,
    };

    try {
      if (editingPage) {
        const res = await api.put(`/api/landing-pages/${editingPage._id}`, data);
        setLandingPages(landingPages.map(p => p._id === editingPage._id ? res.data.landingPage : p));
      } else {
        const res = await api.post('/api/landing-pages', data);
        setLandingPages([res.data.landingPage, ...landingPages]);
      }
      setIsModalOpen(false);
      resetForm();
      alert('Landing page saved successfully!');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save landing page. Check console for details.');
    }
  };

  const resetForm = () => {
    setEditingPage(null);
    setFormData({
      slug: '',
      title: '',
      product: '',
      headline: '',
      subheadline: '',
      description: '',
      features: ['', '', ''],
      benefits: ['', '', ''],
      images: [],
      specialPrice: '',
      originalPrice: '',
      discount: '',
      urgencyText: '',
      isActive: true,
    });
  };

  const copyLink = (slug) => {
    const link = `${window.location.origin}/ad/${slug}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-24 font-sans text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-bold text-white font-display text-glow">Landing Pages</h1>
            <p className="text-gray-400 mt-2 text-lg">Manage your exclusive campaign pages</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-2 shadow-neon-blue"
          >
            <FiPlus className="w-5 h-5" />
            <span>Create New Campaign</span>
          </Button>
        </div>

        {/* Landing Pages List */}
        <div className="grid grid-cols-1 gap-6">
          {landingPages.map((page) => (
            <div 
              key={page._id} 
              className={`bg-white/5 rounded-xl shadow-neon-blue hover:bg-white/10 transition-all duration-300 p-6 border-l-4 ${
                page.isActive ? 'border-primary-500' : 'border-gray-600'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 mb-4 sm:mb-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-white font-display">{page.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
                      page.isActive 
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50' 
                        : 'bg-gray-700 text-gray-400 border border-gray-600'
                    }`}>
                      {page.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-3 italic">{page.headline}</p>
                  <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
                      Product: <span className="font-medium text-gray-300 ml-1">{page.product?.name}</span>
                    </span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                      Views: <span className="font-medium text-gray-300 ml-1">{page.views}</span>
                    </span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      Conversions: <span className="font-medium text-gray-300 ml-1">{page.conversions}</span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => window.open(`/ad/${page.slug}`, '_blank')}
                    className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition flex items-center space-x-2 border border-white/10 font-medium"
                    title="Preview Page"
                  >
                    <FiEye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => copyLink(page.slug)}
                    className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition flex items-center space-x-2 border border-white/10 font-medium"
                    title="Copy Link"
                  >
                    <FiCopy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </button>
                  <div className="w-px h-10 bg-white/10 mx-2 hidden sm:block"></div>
                  <button
                    onClick={() => handleEdit(page)}
                    className="p-2 text-primary-400 hover:bg-primary-500/20 rounded-lg transition"
                    title="Edit"
                  >
                    <FiEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(page._id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                    title="Delete"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {landingPages?.length === 0 && (
            <div className="text-center py-16 bg-white/5 rounded-xl border-2 border-dashed border-white/10">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPlus className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-white">No landing pages yet</h3>
              <p className="text-gray-500 mt-1">Create your first campaign page to get started.</p>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={
            <div className="flex flex-col">
              <span className="text-xl font-display font-bold text-white">
                {editingPage ? 'Edit Campaign' : 'New Campaign'}
              </span>
              <span className="text-sm font-sans font-normal text-gray-400 mt-1">
                {editingPage ? 'Update your landing page details' : 'Create a high-converting landing page'}
              </span>
            </div>
          }
          size="2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-8 text-white">
            {/* Section 1: Campaign Basics */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h4 className="text-sm font-bold text-primary-500 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                Campaign Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="URL Slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="e.g., summer-sale-2024"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Select Product <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white transition-shadow"
                    required
                  >
                    <option value="" className="bg-black text-gray-500">Choose a product...</option>
                    {products && products.map(p => (
                      <option key={p._id} value={p._id} className="bg-black text-white">{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Internal Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Summer Sale Main Campaign"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Page Content */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h4 className="text-sm font-bold text-primary-500 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                Page Content
              </h4>
              <div className="space-y-4">
                <Input
                  label="Main Headline"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="Transform Your Space with Premium Art"
                  required
                />
                <Input
                  label="Subheadline (Optional)"
                  value={formData.subheadline}
                  onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                  placeholder="Limited time offer for our exclusive collection"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Pricing & Offer */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h4 className="text-sm font-bold text-primary-500 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                Pricing & Offer
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Special Price"
                  type="number"
                  step="0.01"
                  value={formData.specialPrice}
                  onChange={(e) => setFormData({ ...formData, specialPrice: e.target.value })}
                  placeholder="0.00"
                />
                <Input
                  label="Original Price"
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="0.00"
                />
                <Input
                  label="Discount %"
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="mt-4">
                <Input
                  label="Urgency Text (Optional)"
                  value={formData.urgencyText}
                  onChange={(e) => setFormData({ ...formData, urgencyText: e.target.value })}
                  placeholder="Only 5 left in stock!"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-300">
                    {formData.isActive ? 'Campaign Active' : 'Campaign Inactive'}
                  </span>
                </label>
              </div>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {editingPage ? 'Update Campaign' : 'Launch Campaign'}
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default LandingPageManagement;
