import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import Head from '../components/layout/Seo';

const BlogList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await fetch('/api/articles');
                const data = await res.json();
                if (data.success) {
                    setArticles(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch articles", err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    return (
        <div className="pt-32 pb-20 container-custom min-h-screen">
            <Head 
                title="MM Universal Blog | Insights & News"
                description="Latest updates, tutorials, and insights on web development, design, and digital marketing."
                keywords="web design blog, digital marketing news, tech tutorials, mm universal blog"
            />

            <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-accent font-medium tracking-wider text-sm uppercase">Our Journal</span>
                <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 mt-2 text-foreground">
                    Insights & <span className="text-gradient-gold">Updates</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                    Expert advice, industry news, and tutorials to help you grow your digital presence.
                </p>
            </div>

            {loading ? (
                <div className="text-center text-white">Loading articles...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article, index) => (
                        <motion.div
                            key={article._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card overflow-hidden group hover:shadow-lg hover:border-accent/30 transition-all duration-300 flex flex-col"
                        >
                            <Link to={`/blog/${article.slug}`} className="block h-48 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                <img 
                                    src={article.image || 'https://via.placeholder.com/800x400?text=MM+Universal+Blog'} 
                                    alt={article.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 z-20 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {article.category || 'News'}
                                </div>
                            </Link>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(article.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        {article.author}
                                    </span>
                                </div>

                                <Link to={`/blog/${article.slug}`} className="group-hover:text-accent transition-colors">
                                    <h3 className="text-xl font-bold font-display mb-3 line-clamp-2 text-foreground">{article.title}</h3>
                                </Link>
                                
                                <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-1">
                                    {article.metaDescription || article.content.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...'}
                                </p>
                                
                                <Link to={`/blog/${article.slug}`} className="flex items-center text-accent text-sm font-bold hover:underline mt-auto">
                                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {!loading && articles.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-slate-400">No articles found yet. Check back soon!</p>
                </div>
            )}
        </div>
    );
};

export default BlogList;
