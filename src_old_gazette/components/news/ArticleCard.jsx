import { Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';

const ArticleCard = ({ article }) => {
  return (
    <div className="group bg-white/5 rounded-sm border border-white/10 overflow-hidden hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop'}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-primary-500 text-xs font-bold uppercase tracking-wider rounded-sm border border-primary-500/30">
            {article.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center text-xs text-gray-400 mb-3 space-x-4">
          <div className="flex items-center">
            <FiCalendar className="mr-1" />
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <FiUser className="mr-1" />
            <span>{article.author}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-primary-500 transition-colors line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-6 line-clamp-3">
          {article.content.substring(0, 150)}...
        </p>
        
        <Link 
          to={`/news/${article.slug}`}
          className="inline-flex items-center text-sm font-bold text-primary-500 uppercase tracking-wider hover:text-white transition-colors"
        >
          <span>Read Article</span>
          <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;
