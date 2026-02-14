import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

import Seo from '../components/layout/Seo';

const Contact = () => {
    // ... (keep existing state logic)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    // ... (keep existing state and handlers)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        const toastId = toast.loading('Sending message...');

        try {
            const res = await fetch('/api/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setFormData({ name: '', email: '', subject: '', message: '' });
                toast.success('Message sent! We will get back to you soon.', { id: toastId });
            } else {
                setError(data.message || 'Failed to send message.');
                toast.error(data.message || 'Failed to send message.', { id: toastId });
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
            toast.error('Something went wrong. Please try again.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };
    
    return (
    <div className="pt-32 pb-20 container-custom">
      <Seo 
          title="Contact Us | Start Your Digital Project"
          description="Get in touch with MM Universal. Let's discuss your web design, SEO, or marketing needs today."
          keywords="contact digital agency, hire web developer, business inquiry"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Let's Talk</h1>
          <p className="text-slate-400 text-lg mb-12 leading-relaxed">
            Have a project in mind? We'd love to hear about it. Send us a message and we'll get back to you within 24 hours.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Email Us</h3>
                <p className="text-slate-400">hello@mmuniversal.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Call Us</h3>
                <p className="text-slate-400">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Office</h3>
                <p className="text-slate-400">
                  123 Business Avenue, Suite 100<br />
                  New York, NY 10001
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email Address</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all" placeholder="john@example.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Subject</label>
              <select value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all">
                <option value="">Select a subject</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Web Development">Web Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Marketing / SEO">Marketing / SEO</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Message</label>
              <textarea required rows="5" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all" placeholder="Tell us about your project..."></textarea>
            </div>

            <button disabled={loading} type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4" />
            </button>
            {success && <p className="text-green-500 text-center text-sm">Message sent successfully!</p>}
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
