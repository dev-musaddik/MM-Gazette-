import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../redux/slices/authSlice';
import { useLanguage } from '../i18n/LanguageContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

/**
 * Login Page
 * User authentication page
 */
const Login = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white/5 border border-white/10 rounded-xl shadow-neon-blue p-8 animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black border border-primary-500 rounded-lg mb-4 shadow-neon-blue">
              <span className="text-primary-500 font-display font-bold text-2xl">MM</span>
            </div>
            <h2 className="text-3xl font-display font-bold text-white text-glow">{t('welcomeBack')}</h2>
            <p className="text-gray-400 mt-2">{t('signInToAccount')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label={t('emailAddress')}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />

            <Input
              label={t('password')}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              {t('signIn')}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {t('dontHaveAccount')}{' '}
              <Link to="/signup" className="text-primary-500 hover:text-primary-400 font-medium transition-colors">
                {t('signup')}
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
            <p className="text-sm text-primary-400 font-medium mb-2">{t('demoCredentials')}</p>
            <p className="text-xs text-gray-400">{t('admin')}: admin@mmgazette.com / admin123</p>
            <p className="text-xs text-gray-400">{t('user')}: user@mmgazette.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
