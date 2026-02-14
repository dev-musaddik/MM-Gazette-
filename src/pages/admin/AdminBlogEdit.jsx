import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { optimizeImage } from '../../utils/imageOptimizer';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminBlogEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const quillRef = useRef(null); // Ref for ReactQuill
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'News',
        tags: '', 
        image: '',
        metaTitle: '',
        metaDescription: '',
        keywords: ''
    });
    
    const [loading, setLoading] = useState(isEditing);
    const [submitting, setSubmitting] = useState(false);

    // ... (useEffect and fetchArticle remain same)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (value) => {
        setFormData(prev => ({ ...prev, content: value }));
    };

    // Custom Image Handler for Quill
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                const loadingToast = toast.loading("Optimizing & Uploading image...");
                try {
                    const optimizedFile = await optimizeImage(file, 1200, 0.8);
                    const dataPayload = new FormData();
                    dataPayload.append('image', optimizedFile);

                    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                    const res = await fetch('/api/upload', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${userInfo.token}`
                        },
                        body: dataPayload
                    });

                    const data = await res.json();
                    if (res.ok) {
                        const quill = quillRef.current.getEditor();
                        const range = quill.getSelection(true);
                        quill.insertEmbed(range.index, 'image', data.imageUrl);
                        toast.success("Image added to content");
                    } else {
                        toast.error(data.message || "Upload failed");
                    }
                } catch (error) {
                    console.error(error);
                    toast.error("Error uploading image");
                } finally {
                    toast.dismiss(loadingToast);
                }
            }
        };
    };

    // Memoize modules to prevent re-rendering and attaching handler
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const loadingToast = toast.loading("Optimizing & Uploading image...");

        try {
            // Optimize image before upload
            const optimizedFile = await optimizeImage(file, 1200, 0.8);
            
            const data = new FormData();
            data.append('image', optimizedFile);

           const userInfo = JSON.parse(localStorage.getItem('userInfo'));
           const res = await fetch('/api/upload', { // Assuming generic upload route exists
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: data
            });

            const result = await res.json();
            if (res.ok) {
                setFormData(prev => ({ ...prev, image: result.imageUrl })); // Fixed to match backend response
                toast.success("Image uploaded successfully");
            } else {
                toast.error(result.message || "Upload failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error uploading image");
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const url = isEditing ? `/api/articles/${id}` : '/api/articles';
            const method = isEditing ? 'PUT' : 'POST';

            // Process tags
            const processedData = {
                ...formData,
                tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : formData.tags
            };

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify(processedData)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(isEditing ? "Article updated!" : "Article created!");
                navigate('/admin/blog');
            } else {
                toast.error(data.message || "Operation failed");
            }
        } catch (err) {
            toast.error("Network error");
        } finally {
            setSubmitting(false);
        }
    };

    // ... (loading check remains same)

    return (
        <AdminLayout>
            <div className="p-6 max-w-5xl mx-auto">
                <Link to="/admin/blog" className="inline-flex items-center text-slate-400 hover:text-white mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
                </Link>

                <h1 className="text-3xl font-bold font-display mb-8">
                    {isEditing ? 'Edit Article' : 'Create New Article'}
                </h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main Content Area (Left/Top) */}
                        <div className="flex-1 space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300">Article Title</label>
                                <input 
                                    type="text" 
                                    name="title"
                                    value={formData.title} 
                                    onChange={handleChange}
                                    className="input-field w-full text-xl md:text-2xl font-display font-bold py-4"
                                    placeholder="Enter article title here..."
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300">Content</label>
                                <div className="glass-card overflow-hidden bg-white/5 border border-white/10">
                                    <div className="bg-white text-black min-h-[600px]">
                                        <ReactQuill 
                                            ref={quillRef}
                                            theme="snow" 
                                            value={formData.content} 
                                            onChange={handleContentChange}
                                            modules={modules}
                                            className="h-[550px]" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Sidebar (Right)... rest of code */}

                        {/* Sidebar (Right) */}
                        <div className="w-full lg:w-96 space-y-6">
                            {/* Actions Card */}
                            <div className="glass-card p-6 space-y-4">
                                <h3 className="font-bold text-lg text-white mb-2">Publish</h3>
                                <div className="text-sm text-slate-400 mb-4">
                                    Status: <span className="text-accent">{isEditing ? 'Published' : 'Draft'}</span>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                                >
                                    <Save className="w-5 h-5" /> 
                                    {submitting ? 'Saving...' : 'Save Article'}
                                </button>
                            </div>

                            {/* Featured Image Card */}
                            <div className="glass-card p-6 space-y-4">
                                <h3 className="font-bold text-lg text-white">Featured Image</h3>
                                <div className="border-dashed border-2 border-white/20 hover:border-accent/50 transition-colors rounded-xl p-4 text-center">
                                    {formData.image ? (
                                        <div className="relative group">
                                            <img src={formData.image} alt="Preview" className="w-full h-48 object-cover rounded-lg shadow-lg" />
                                            <button 
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                                className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="py-8 flex flex-col items-center justify-center text-slate-400">
                                            <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
                                            <p className="text-sm mb-4">No image selected</p>
                                            <label className="btn-outline cursor-pointer inline-flex items-center gap-2 text-sm">
                                                <Upload className="w-4 h-4" /> Upload Image
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                            </label>
                                        </div>
                                    )}
                                    {formData.image && (
                                         <label className="btn-outline cursor-pointer inline-flex items-center gap-2 text-sm mt-4 w-full justify-center">
                                            <Upload className="w-4 h-4" /> Change Image
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Organization Card */}
                            <div className="glass-card p-6 space-y-4">
                                <h3 className="font-bold text-lg text-white">Organization</h3>
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-slate-300">Category</label>
                                    <select 
                                        name="category" 
                                        value={formData.category} 
                                        onChange={handleChange}
                                        className="input-field w-full"
                                    >
                                        <option value="News">News</option>
                                        <option value="Review">Review</option>
                                        <option value="Tutorial">Tutorial</option>
                                        <option value="Opinion">Opinion</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-slate-300">Tags</label>
                                    <input 
                                        type="text" 
                                        name="tags"
                                        value={formData.tags} 
                                        onChange={handleChange}
                                        className="input-field w-full"
                                        placeholder="tech, web, design"
                                    />
                                    <p className="text-xs text-slate-500">Separate tags with commas</p>
                                </div>
                            </div>

                            {/* SEO Card */}
                            <div className="glass-card p-6 space-y-4">
                                <h3 className="font-bold text-lg text-accent">SEO Configuration</h3>
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-slate-300">Meta Title</label>
                                    <input 
                                        type="text" 
                                        name="metaTitle"
                                        value={formData.metaTitle} 
                                        onChange={handleChange}
                                        className="input-field w-full"
                                        placeholder="SEO Title (max 60 chars)"
                                        maxLength={60}
                                    />
                                    <div className="text-right text-xs text-slate-500">{formData.metaTitle.length}/60</div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-slate-300">Meta Description</label>
                                    <textarea 
                                        name="metaDescription"
                                        value={formData.metaDescription} 
                                        onChange={handleChange}
                                        className="input-field w-full h-24 resize-none"
                                        placeholder="SEO Description (max 160 chars)"
                                        maxLength={160}
                                    />
                                    <div className="text-right text-xs text-slate-500">{formData.metaDescription.length}/160</div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-slate-300">Keywords</label>
                                    <input 
                                        type="text" 
                                        name="keywords"
                                        value={formData.keywords} 
                                        onChange={handleChange}
                                        className="input-field w-full"
                                        placeholder="keyword1, keyword2"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AdminBlogEdit;
