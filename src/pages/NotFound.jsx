import { Link } from 'react-router-dom';
import { FiArrowLeft, FiHome } from 'react-icons/fi';

/**
 * NotFound Page
 * "Tech/Futuristic" looking 404 page
 */
const NotFound = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden font-display selection:bg-primary-500 selection:text-black">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[128px] animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-[128px] animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-900/10 to-transparent opacity-50"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Glass Card */}
        <div className="bg-white/5 rounded-3xl p-12 md:p-16 border border-white/10 shadow-neon-blue backdrop-blur-xl animate-fade-in-up">
          
          {/* 404 Text */}
          <div className="relative mb-8">
            <h1 className="text-[120px] md:text-[180px] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary-200 via-primary-400 to-primary-700 animate-pulse-slow drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary-500/20 blur-3xl -z-10 rounded-full opacity-20"></div>
          </div>

          {/* Divider */}
          <div className="flex justify-center items-center gap-4 mb-8 opacity-60">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary-500"></div>
            <div className="w-2 h-2 rotate-45 border border-primary-500"></div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary-500"></div>
          </div>

          {/* Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-wide text-glow">
            System Error
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-md mx-auto font-light leading-relaxed">
            The page you are looking for has been disconnected or does not exist in our database.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/">
              <button className="group relative px-8 py-4 bg-primary-500 text-black font-bold tracking-wider uppercase text-sm rounded-lg overflow-hidden transition-all hover:shadow-neon-blue hover:scale-105">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shine"></div>
                <span className="relative flex items-center gap-2">
                  <FiHome className="w-4 h-4" />
                  Return Home
                </span>
              </button>
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="group px-8 py-4 border border-white/10 text-white font-medium tracking-wider uppercase text-sm rounded-lg hover:bg-white/5 transition-all hover:border-primary-500/50 flex items-center gap-2"
            >
              <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Go Back
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-white/20 text-xs tracking-[0.2em] uppercase">
          MM Gazette BD • Tech & Gadgets
        </p>
      </div>
    </div>
  );
};

export default NotFound;
