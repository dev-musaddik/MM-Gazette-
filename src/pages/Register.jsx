import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import Seo from '../components/layout/Seo';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            
            const data = await res.json();
            
            if (res.ok) {
                // Auto login after register
                localStorage.setItem('userInfo', JSON.stringify(data));
                navigate('/');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Server connection failed. Please try again.');
        }
    };

    return (
        <div className="pt-32 min-h-screen container-custom flex items-center justify-center pb-20">
            <Seo title="Register | MM Universal" />
            
            <div className="glass-card p-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-bold">Create Account</h2>
                    <p className="text-slate-400 mt-2">Join MM Universal today.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all" 
                                placeholder="John Doe"
                                required 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all" 
                                placeholder="john@example.com"
                                required 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all" 
                                placeholder="••••••••"
                                required 
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full shadow-lg shadow-accent/20">
                        Register
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-accent hover:underline">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
