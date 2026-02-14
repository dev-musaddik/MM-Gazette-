import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands, createBrand, updateBrand, deleteBrand } from '../../redux/slices/brandSlice';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const BrandManagement = () => {
  const dispatch = useDispatch();
  const { brands, loading } = useSelector((state) => state.brands);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      dispatch(deleteBrand(id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBrand) {
      dispatch(updateBrand({ id: editingBrand._id, brandData: formData }));
    } else {
      dispatch(createBrand(formData));
    }
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingBrand(null);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="min-h-screen bg-black py-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-display font-bold text-white text-glow">Brand Management</h1>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-2 shadow-neon-blue"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add Brand</span>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-neon-blue">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {brands.map((brand) => (
                  <tr key={brand._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{brand.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{brand.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{brand.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(brand)}
                        className="text-primary-500 hover:text-primary-400 mr-4 transition-colors"
                      >
                        <FiEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(brand._id)}
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
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editingBrand ? 'Edit Brand' : 'Add New Brand'}
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-white">
            <Input
              label="Brand Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-500"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">{editingBrand ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default BrandManagement;
