import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowLeft, Clock } from 'lucide-react';
import Head from '../components/layout/Seo';

const BlogDetail = () => {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await fetch(`/api/articles/${slug}`);
                const data = await res.json();
                if (data.success) {
                    setArticle(data.data);
                } else {
                    setError(true);
                }
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [slug]);

    if (loading) return <div className="pt-32 pb-20 text-center text-white">Loading article...</div>;
    
    if (error || !article) return (
        <div className="pt-32 pb-20 container-custom text-center min-h-[60vh] flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
            <Link to="/blog" className="btn-primary">Back to Blog</Link>
        </div>
    );

    // Calculate read time roughly
    const readTime = Math.ceil(article.content.split(' ').length / 200);

    return (
        <div className="pt-32 pb-20 container-custom">
            <Head 
                title={`${article.metaTitle || article.title} | MM Universal Blog`}
                description={article.metaDescription || article.content.substring(0, 160)}
                keywords={article.keywords}
                image={article.image}
                type="article"
                date={article.createdAt}
                schema={{
                    "@type": "BlogPosting",
                    "headline": article.title,
                    "image": article.image,
                    "author": {
                        "@type": "Person",
                        "name": article.author
                    },
                    "datePublished": article.createdAt,
                    "articleBody": article.content.replace(/<[^>]*>?/gm, '')
                }}
            />

            <Link to="/blog" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Link>

            <article className="max-w-4xl mx-auto">
                <header className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <span className="bg-accent/10 text-accent border border-accent/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            {article.category}
                        </span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8 leading-tight">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 text-sm">
                        <span className="flex items-center gap-2">
                            <User className="w-4 h-4" /> {article.author}
                        </span>
                        <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> {new Date(article.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" /> {readTime} min read
                        </span>
                    </div>
                </header>

                {article.image && (
                    <div className="mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                        <img 
                            src={article.image} 
                            alt={article.title} 
                            className="w-full h-auto object-cover max-h-[600px]"
                        />
                    </div>
                )}

                <div 
                    className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-accent prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {article.tags && article.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag, index) => (
                                <span key={index} className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-md text-sm text-slate-300">
                                    <Tag className="w-3 h-3" /> {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </article>
            
            {/* CTA Section */}
            <div className="mt-20 p-12 bg-gradient-to-br from-white/5 to-transparent rounded-3xl border border-white/10 text-center">
                <h3 className="text-2xl font-bold mb-4">Want to implement this for your business?</h3>
                <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                    We help businesses build digital products that scale. Contact us today to discuss your project.
                </p>
                <Link to="/contact" className="btn-primary">
                    Get in Touch
                </Link>
            </div>
        </div>
    );
};

export default BlogDetail;
