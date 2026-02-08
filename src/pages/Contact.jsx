import { FiMapPin, FiPhone, FiMail, FiSend } from 'react-icons/fi';

const Contact = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-12 text-white">
      {/* Header */}
      <div className="bg-primary-900/20 text-white py-20 relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 animate-fade-in text-glow">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 font-body font-light tracking-wide max-w-2xl mx-auto animate-slide-up delay-100">
            We'd love to hear from you. Get in touch with us for any queries or support.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="animate-slide-up">
            <h2 className="text-3xl font-display font-bold text-primary-500 mb-8 text-glow">Get in Touch</h2>
            <div className="space-y-8">
              <div className="flex items-start space-x-4 group">
                <div className="w-12 h-12 bg-primary-500/10 text-primary-500 rounded-full flex items-center justify-center flex-shrink-0 border border-primary-500/30 group-hover:scale-110 transition-transform shadow-neon-blue">
                  <FiMapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white mb-1 group-hover:text-primary-500 transition-colors">Visit Us</h3>
                  <p className="text-gray-400">123 Tech Park, Gulshan Avenue<br />Dhaka, Bangladesh</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 group">
                <div className="w-12 h-12 bg-primary-500/10 text-primary-500 rounded-full flex items-center justify-center flex-shrink-0 border border-primary-500/30 group-hover:scale-110 transition-transform shadow-neon-blue">
                  <FiPhone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white mb-1 group-hover:text-primary-500 transition-colors">Call Us</h3>
                  <p className="text-gray-400">+880 1234 567890<br />Mon - Fri, 9am - 6pm</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 group">
                <div className="w-12 h-12 bg-primary-500/10 text-primary-500 rounded-full flex items-center justify-center flex-shrink-0 border border-primary-500/30 group-hover:scale-110 transition-transform shadow-neon-blue">
                  <FiMail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white mb-1 group-hover:text-primary-500 transition-colors">Email Us</h3>
                  <p className="text-gray-400">support@mmgazette.com<br />info@mmgazette.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/5 p-8 rounded-2xl shadow-neon-blue animate-slide-up delay-200 border border-white/10">
            <h2 className="text-2xl font-display font-bold text-white mb-6">Send Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-gray-600" placeholder="Your Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-gray-600" placeholder="Your Email" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-gray-600" placeholder="Message Subject" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea rows="4" className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-gray-600" placeholder="Your Message"></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-primary-500 text-black font-bold rounded-lg hover:bg-white transition-colors shadow-neon-blue flex items-center justify-center space-x-2 uppercase tracking-wider">
                <span>Send Message</span>
                <FiSend />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
