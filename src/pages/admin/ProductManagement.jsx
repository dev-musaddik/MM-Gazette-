import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, createProduct, updateProduct } from '../../redux/slices/productSlice';
import { fetchCategories } from '../../redux/slices/categorySlice';
import { fetchBrands } from '../../redux/slices/brandSlice';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';
import { FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

/**
 * Product Management Page (Admin)
 * CRUD operations for products
 */
const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { brands } = useSelector((state) => state.brands);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Smartphone',
    brand: '',
    basePrice: '',
    stock: '',
    images: [],
    featured: false,
    specs: {},
  });
  
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  useEffect(() => {
    dispatch(fetchProducts({}));
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      brand: product.brand || '',
      basePrice: product.basePrice,
      stock: product.stock,
      images: product.images || [],
      featured: product.featured || false,
      specs: product.specs || {},
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      basePrice: parseFloat(formData.basePrice),
      stock: parseInt(formData.stock),
    };

    if (editingProduct) {
      dispatch(updateProduct({ productId: editingProduct._id, productData }));
    } else {
      dispatch(createProduct(productData));
    }

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: 'Smartphone',
      brand: '',
      basePrice: '',
      stock: '',
      images: [],
      featured: false,
      specs: {},
    });
    setNewSpecKey('');
    setNewSpecValue('');
  };

  return (
    <div className="min-h-screen bg-black py-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-display font-bold text-white text-glow">Product Management</h1>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-2 shadow-neon-blue"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add Product</span>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden md:block bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-neon-blue">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded object-cover"
                              src={product.images?.[0] || '/placeholder-product.jpg'}
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-sm bg-primary-500/20 text-primary-500 border border-primary-500/50">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {product.brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        ${product.basePrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-primary-500 hover:text-primary-400 mr-4 transition-colors"
                        >
                          <FiEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {products.map((product) => (
                <div key={product._id} className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={product.images?.[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-white truncate">{product.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="inline-flex text-xs leading-5 font-semibold rounded-sm bg-primary-500/20 text-primary-500 border border-primary-500/50">
                          {product.category}
                        </span>
                        <span className="inline-flex text-xs leading-5 font-semibold rounded-sm bg-white/10 text-gray-300 border border-white/10">
                          {product.brand}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Price</p>
                      <p className="text-sm font-medium text-white">${product.basePrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Stock</p>
                      <p className="text-sm font-medium text-white">{product.stock}</p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-2 border-t border-white/10">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex items-center px-3 py-2 text-sm font-medium text-primary-500 bg-primary-500/10 rounded-sm hover:bg-primary-500/20 border border-primary-500/30"
                    >
                      <FiEdit className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex items-center px-3 py-2 text-sm font-medium text-red-500 bg-red-500/10 rounded-sm hover:bg-red-500/20 border border-red-500/30"
                    >
                      <FiTrash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editingProduct ? 'Edit Product' : 'Add New Product'}
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-white">
            <Input
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                >
                  <option value="" className="bg-black text-white">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name} className="bg-black text-white">{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Brand
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                  required
                >
                  <option value="" className="bg-black text-white">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand.name} className="bg-black text-white">{brand.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Base Price"
                type="number"
                step="0.01"
                name="basePrice"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                required
              />

              <Input
                label="Stock"
                type="number"
                name="stock"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files);
                  if (files.length === 0) return;

                  // Show uploading state
                  const uploadingImages = files.map(f => URL.createObjectURL(f));
                  setFormData({ ...formData, uploadingImages });

                  try {
                    const uploadedUrls = [];
                    
                    for (const file of files) {
                      const formDataUpload = new FormData();
                      formDataUpload.append('image', file);

                      const response = await fetch('/api/upload', {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                        body: formDataUpload,
                      });

                      const data = await response.json();
                      if (data.success) {
                        uploadedUrls.push(data.imageUrl);
                      }
                    }

                    setFormData({
                      ...formData,
                      images: [...(formData.images || []), ...uploadedUrls],
                      uploadingImages: null,
                    });
                  } catch (error) {
                    console.error('Upload failed:', error);
                    toast.error('Failed to upload images');
                    setFormData({ ...formData, uploadingImages: null });
                  }
                }}
                className="w-full px-4 py-3 sm:py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500/10 file:text-primary-400 hover:file:bg-primary-500/20"
              />
              <p className="text-xs text-gray-400 mt-1">
                Upload product images (automatically optimized).
              </p>
              
              {/* Display uploaded images */}
              {formData.images && formData.images.length > 0 && (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== index);
                          setFormData({ ...formData, images: newImages });
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Show uploading state */}
              {formData.uploadingImages && (
                <div className="mt-3">
                  <p className="text-sm text-primary-400">Uploading and optimizing images...</p>
                </div>
              )}
            </div>

            {/* Specs Section */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tech Specs
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  placeholder="Key (e.g. RAM)"
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-500"
                />
                <input
                  type="text"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  placeholder="Value (e.g. 16GB)"
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newSpecKey.trim() && newSpecValue.trim()) {
                        setFormData({
                          ...formData,
                          specs: { ...formData.specs, [newSpecKey.trim()]: newSpecValue.trim() }
                        });
                        setNewSpecKey('');
                        setNewSpecValue('');
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newSpecKey.trim() && newSpecValue.trim()) {
                      setFormData({
                        ...formData,
                        specs: { ...formData.specs, [newSpecKey.trim()]: newSpecValue.trim() }
                      });
                      setNewSpecKey('');
                      setNewSpecValue('');
                    }
                  }}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 border border-white/10"
                >
                  <FiPlus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(formData.specs).map(([key, value]) => (
                  <span key={key} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-400 border border-primary-500/30">
                    <span className="font-bold mr-1 text-white">{key}:</span> {value}
                    <button
                      type="button"
                      onClick={() => {
                        const newSpecs = { ...formData.specs };
                        delete newSpecs[key];
                        setFormData({ ...formData, specs: newSpecs });
                      }}
                      className="ml-2 text-primary-400 hover:text-red-400"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="mr-2 w-5 h-5 accent-primary-500"
              />
              <span className="text-sm text-gray-300">Featured Product</span>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
              <Button type="submit" variant="primary" fullWidth>
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default ProductManagement;
