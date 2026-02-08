import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles, setArticleFilters } from '../redux/slices/articleSlice';
import ArticleCard from '../components/news/ArticleCard';
import Spinner from '../components/common/Spinner';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const News = () => {
  const dispatch = useDispatch();
  const { articles, loading, filters } = useSelector((state) => state.articles);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { value: '', label: 'All News' },
    { value: 'News', label: 'Tech News' },
    { value: 'Review', label: 'Reviews' },
    { value: 'Tutorial', label: 'Tutorials' },
    { value: 'Opinion', label: 'Opinions' },
  ];

  useEffect(() => {
    dispatch(fetchArticles(filters));
  }, [dispatch, filters]);

  const handleCategoryChange = (category) => {
    dispatch(setArticleFilters({ category: category || null }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Assuming backend supports search, otherwise filter locally
    // For now, let's just log it or implement if backend supports
    console.log('Search:', searchTerm);
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-12 text-white">
      {/* Header Section */}
      <div className="bg-primary-900/20 text-white py-16 mb-12 relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=2062&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 animate-fade-in text-glow">
            Tech Gazette
          </h1>
          <p className="text-xl text-gray-400 font-body font-light tracking-wide max-w-2xl mx-auto animate-slide-up delay-100">
            Latest news, reviews, and insights from the world of technology.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="glass-card rounded-sm p-6 mb-12 shadow-neon-blue animate-slide-up delay-200">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-5 py-2 rounded-sm text-sm font-bold uppercase tracking-wider transition-all duration-300 skew-x-[-10deg] ${
                  filters.category === cat.value || (!filters.category && !cat.value)
                    ? 'bg-primary-500 text-black shadow-neon-blue scale-105'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <span className="block skew-x-[10deg]">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="flex justify-center py-32">
            <Spinner size="lg" />
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <div 
                key={article._id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white/5 rounded-xl border border-dashed border-white/10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-full mb-6">
              <FiSearch className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-2">No Articles Found</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              We couldn't find any articles matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
