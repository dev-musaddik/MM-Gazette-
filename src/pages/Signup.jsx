import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup, clearError } from '../redux/slices/authSlice';
import { useLanguage } from '../i18n/LanguageContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

/**
 * Signup Page
 * User registration page
 */
const Signup = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');

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
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error(t('passwordsDoNotMatch'));
      return;
    }

    if (formData.password?.length < 6) {
      toast.error(t('passwordTooShort'));
      return;
    }

    const { confirmPassword, ...signupData } = formData;
    dispatch(signup(signupData));
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
            <h2 className="text-3xl font-display font-bold text-white text-glow">{t('createAccount')}</h2>
            <p className="text-gray-400 mt-2">{t('joinGallery')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label={t('fullName')}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />

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

            <Input
              label={t('confirmPassword')}
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
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
              {t('createAccount')}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {t('alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-400 font-medium transition-colors">
                {t('signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
