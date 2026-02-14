import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../redux/api/apiService';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiFileText } from 'react-icons/fi';

const ArticleManagement = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'News',
    image: '',
    tags: '',
    published: true,
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data } = await api.get('/api/articles');
      setArticles(data.data);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const articleData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      if (editingArticle) {
        await api.put(`/api/articles/${editingArticle._id}`, articleData);
        toast.success('Article updated successfully');
      } else {
        await api.post('/api/articles', articleData);
        toast.success('Article created successfully');
      }
      
      setIsModalOpen(false);
      fetchArticles();
      resetForm();
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error(error.response?.data?.message || 'Failed to save article');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await api.delete(`/api/articles/${id}`);
        toast.success('Article deleted successfully');
        fetchArticles();
      } catch (error) {
        console.error('Error deleting article:', error);
        toast.error('Failed to delete article');
      }
    }
  };

  const openModal = (article = null) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        content: article.content,
        category: article.category,
        image: article.image,
        tags: article.tags.join(', '),
        published: article.published,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      content: '',
      category: 'News',
      image: '',
      tags: '',
      published: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-display font-bold text-white text-glow">Article Management</h1>
          <button
            onClick={() => openModal()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all shadow-neon-blue"
          >
            <FiPlus /> Add Article
          </button>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-neon-blue">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {articles.map((article) => (
                  <tr key={article._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-700 rounded-md overflow-hidden">
                          {article.image ? (
                            <img className="h-10 w-10 object-cover" src={article.image} alt="" />
                          ) : (
                            <FiFileText className="h-full w-full p-2 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white truncate max-w-xs" title={article.title}>{article.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        article.category === 'Review' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        article.published ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {article.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openModal(article)}
                        className="text-primary-400 hover:text-primary-300 mr-4 transition-colors"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(article._id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingArticle ? 'Edit Article' : 'Add New Article'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="News">News</option>
              <option value="Review">Review</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Opinion">Opinion</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows="6"
              className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="Tech, Review, Gadget"
              className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-300">
              Published
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-neon-blue"
            >
              {editingArticle ? 'Update Article' : 'Create Article'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ArticleManagement;
