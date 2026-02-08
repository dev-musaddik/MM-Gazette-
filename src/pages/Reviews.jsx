import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles, setArticleFilters } from '../redux/slices/articleSlice';
import ArticleCard from '../components/news/ArticleCard';
import Spinner from '../components/common/Spinner';
import { FiStar } from 'react-icons/fi';

const Reviews = () => {
  const dispatch = useDispatch();
  const { articles, loading } = useSelector((state) => state.articles);

  useEffect(() => {
    // Fetch only articles with category 'Review'
    dispatch(setArticleFilters({ category: 'Review' }));
    dispatch(fetchArticles({ category: 'Review' }));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-black pt-20 pb-12 text-white">
      {/* Header Section */}
      <div className="bg-primary-900/20 text-white py-16 mb-12 relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2001&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 animate-fade-in text-glow">
            Tech Reviews
          </h1>
          <p className="text-xl text-gray-400 font-body font-light tracking-wide max-w-2xl mx-auto animate-slide-up delay-100">
            In-depth analysis and honest opinions on the latest gadgets.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <FiStar className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-2">No Reviews Found</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              We haven't published any reviews yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
