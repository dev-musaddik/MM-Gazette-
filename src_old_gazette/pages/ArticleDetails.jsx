import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticleBySlug, clearSelectedArticle } from '../redux/slices/articleSlice';
import Spinner from '../components/common/Spinner';
import { FiCalendar, FiUser, FiArrowLeft, FiTag } from 'react-icons/fi';

const ArticleDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { selectedArticle: article, loading } = useSelector((state) => state.articles);

  useEffect(() => {
    dispatch(fetchArticleBySlug(slug));
    return () => {
      dispatch(clearSelectedArticle());
    };
  }, [dispatch, slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Article Not Found</h2>
          <Link to="/news" className="text-primary-500 hover:text-primary-400">
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20 text-white">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/news" className="inline-flex items-center text-gray-400 hover:text-primary-500 mb-8 transition-colors">
          <FiArrowLeft className="mr-2" />
          Back to News
        </Link>

        <header className="mb-10 text-center">
          <div className="flex justify-center mb-4">
            <span className="px-3 py-1 bg-primary-500/20 text-primary-500 text-xs font-bold uppercase tracking-wider rounded-sm border border-primary-500/50">
              {article.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 text-glow leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center justify-center text-sm text-gray-400 space-x-6">
            <div className="flex items-center">
              <FiCalendar className="mr-2" />
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <FiUser className="mr-2" />
              <span>{article.author}</span>
            </div>
          </div>
        </header>

        {article.image && (
          <div className="mb-12 rounded-xl overflow-hidden shadow-neon-blue border border-white/10">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-auto object-cover max-h-[600px]"
            />
          </div>
        )}

        <div className="prose prose-invert prose-lg max-w-none mb-12">
          {/* 
            In a real app, use a markdown renderer or HTML parser. 
            For now, just displaying text with simple whitespace handling.
          */}
          <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
            {article.content}
          </div>
        </div>

        {article.tags && article.tags?.length > 0 && (
          <div className="border-t border-white/10 pt-8 mt-12">
            <div className="flex items-center flex-wrap gap-2">
              <FiTag className="text-primary-500 mr-2" />
              {article.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-white/5 text-gray-300 text-sm rounded-full border border-white/10">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default ArticleDetails;
