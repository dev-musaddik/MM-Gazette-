import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../redux/slices/categorySlice';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      dispatch(updateCategory({ id: editingCategory._id, categoryData: formData }));
    } else {
      dispatch(createCategory(formData));
    }
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="min-h-screen bg-black py-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-display font-bold text-white text-glow">Category Management</h1>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-2 shadow-neon-blue"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add Category</span>
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
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{category.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{category.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-primary-500 hover:text-primary-400 mr-4 transition-colors"
                      >
                        <FiEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
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
          title={editingCategory ? 'Edit Category' : 'Add New Category'}
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-white">
            <Input
              label="Category Name"
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
              <Button type="submit" variant="primary">{editingCategory ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryManagement;
