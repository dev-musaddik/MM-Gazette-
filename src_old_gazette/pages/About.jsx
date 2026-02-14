import { FiAward, FiUsers, FiTarget } from 'react-icons/fi';

const About = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-12 text-white">
      {/* Header */}
      <div className="bg-primary-900/20 text-white py-20 relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 animate-fade-in text-glow">
            About MM Gazette BD
          </h1>
          <p className="text-xl text-gray-300 font-body font-light tracking-wide max-w-2xl mx-auto animate-slide-up delay-100">
            Your ultimate destination for cutting-edge technology and gadgets.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="animate-slide-in-right">
            <h2 className="text-3xl font-display font-bold text-primary-500 mb-6 text-glow">Our Story</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Founded with a passion for innovation and technology, MM Gazette BD has grown from a small tech blog into a premier gadget destination. We believe that technology is more than just tools; it's a lifestyle that empowers and connects us.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Our journey began with a simple mission: to provide authentic, high-quality gadgets and expert reviews to help you make informed decisions. Today, we continue to curate the latest tech that blends performance with style.
            </p>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-neon-blue animate-fade-in delay-200 border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop" 
              alt="Our Story" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: <FiAward className="w-8 h-8" />, title: "Authenticity", desc: "We guarantee 100% authentic products with official warranties." },
            { icon: <FiUsers className="w-8 h-8" />, title: "Expert Support", desc: "Our team of tech experts is here to guide you every step of the way." },
            { icon: <FiTarget className="w-8 h-8" />, title: "Innovation", desc: "We constantly update our inventory with the latest global tech trends." }
          ].map((value, index) => (
            <div key={index} className="bg-white/5 p-8 rounded-xl text-center hover:bg-white/10 transition-colors duration-300 border border-white/10 hover:border-primary-500/30 group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/10 text-primary-500 rounded-full shadow-neon-blue mb-6 group-hover:scale-110 transition-transform">
                {value.icon}
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-primary-500 transition-colors">{value.title}</h3>
              <p className="text-gray-400 text-sm">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
