import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiArrowRight } from 'react-icons/fi';
import api from '../../redux/api/apiService';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim()?.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const { data } = await api.get(`/api/products?search=${query}&limit=5`);
        setSuggestions(data.data);
      } catch (error) {
        console.error('Failed to fetch suggestions', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${query}`);
      onClose();
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/products/${productId}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-black border border-white/10 rounded-xl shadow-neon-blue overflow-hidden animate-slide-up">
        <form onSubmit={handleSearch} className="relative flex items-center border-b border-white/10 p-4">
          <FiSearch className="w-6 h-6 text-primary-500 mr-4" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for gadgets..."
            className="flex-1 bg-transparent text-white text-lg placeholder-gray-500 outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </form>

        {/* Suggestions */}
        {(suggestions?.length > 0 || loading) && (
          <div className="p-4 bg-white/5">
            {loading ? (
              <div className="text-center py-4 text-gray-400">Searching...</div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Suggestions</h3>
                {suggestions.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleSuggestionClick(product._id)}
                    className="flex items-center p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors group"
                  >
                    <img
                      src={product.images?.[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md mr-4 border border-white/10"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium group-hover:text-primary-500 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-400 capitalize">{product.category}</p>
                    </div>
                    <FiArrowRight className="w-4 h-4 text-gray-500 group-hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                ))}
                <button
                  onClick={handleSearch}
                  className="w-full text-center py-3 text-primary-500 hover:text-primary-400 text-sm font-bold uppercase tracking-wider mt-2"
                >
                  View All Results
                </button>
              </div>
            )}
          </div>
        )}
        
        {!loading && query?.length >= 2 && suggestions?.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No products found matching "{query}"
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
