import { useState, useEffect } from 'react';
import { ShieldCheck, Truck, CreditCard, Loader2, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LandingCheckout = ({ product, landingPageId }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [quantity, setQuantity] = useState(1);
    const [userInfo, setUserInfo] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        paymentMethod: 'Cash on Delivery'
    });

    useEffect(() => {
        const user = localStorage.getItem('userInfo');
        if (user) {
            const parsedUser = JSON.parse(user);
            setUserInfo(parsedUser);
            setFormData(prev => ({
                ...prev,
                fullName: parsedUser.name,
                email: parsedUser.email
            }));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleQuantityChange = (e) => {
        const val = parseInt(e.target.value);
        if (val > 0) setQuantity(val);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        if (!product || (!product._id && !product.name)) {
            setError(t('checkout.invalidProduct'));
            setSubmitting(false);
            return;
        }

        try {
            const orderItems = [{
                product: product._id || null, 
                name: product.name,
                quantity: quantity,
                price: product.basePrice || product.price || 0
            }];

            const orderData = {
                items: orderItems,
                shippingAddress: {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    country: formData.country,
                },
                paymentMethod: formData.paymentMethod,
                deliveryCharge: 0,
                landingPage: landingPageId 
            };

            const endpoint = userInfo ? '/api/orders' : '/api/orders/guest';
            const headers = { 'Content-Type': 'application/json' };
            if (userInfo) {
                headers['Authorization'] = `Bearer ${userInfo.token}`;
            }

            const res = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify(orderData)
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                toast.success(t('checkout.orderSuccess'));
            } else {
                toast.error(data.message || t('checkout.orderFailed'));
                setError(data.message || t('checkout.orderFailed'));
            }
        } catch (err) {
            console.error("Order submission error:", err);
            toast.error(err.message || t('checkout.orderFailed'));
            setError(err.message || t('checkout.orderFailed'));
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
             <div className="w-full max-w-2xl mx-auto bg-green-50/50 border border-green-200 rounded-2xl p-12 text-center animate-in fade-in zoom-in duration-300 transition-all">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">{t('checkout.orderConfirmed')}</h3>
                <p className="text-slate-600 mb-8 text-lg">
                    {t('checkout.thankYou')} <strong>{formData.email}</strong>.
                </p>
                <button 
                    onClick={() => navigate('/')}
                    className="btn-primary px-8 py-3"
                >
                    {t('checkout.returnHome')}
                </button>
            </div>
        );
    }

    if (!product) return <div className="text-center text-red-500">{t('checkout.invalidProduct')}</div>;

    const unitPrice = product.price > 0 ? product.price : (product.basePrice || 0);
    const totalPrice = unitPrice * quantity;

    return (
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
             
             {/* Left Column: Form (Span 7) */}
             <div className="lg:col-span-7 order-2 lg:order-1 bg-card border border-border rounded-2xl p-6 md:p-8 shadow-xl">
                <h3 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                    <Truck className="w-6 h-6 text-accent" /> {t('checkout.shippingBilling')}
                </h3>
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" /> {error}
                    </div>
                )}
                
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">{t('checkout.fullName')}</label>
                            <input 
                                required 
                                name="fullName" 
                                value={formData.fullName} 
                                onChange={handleChange} 
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all"
                                placeholder={t('checkout.fullName')}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">{t('checkout.emailAddress')}</label>
                            <input 
                                required 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all"
                                placeholder={t('checkout.emailAddress')}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">{t('checkout.phoneNumber')}</label>
                        <input 
                            required 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all"
                             placeholder={t('checkout.phoneNumber')}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">{t('checkout.address')}</label>
                        <input 
                            required 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all"
                             placeholder={t('checkout.address')}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">{t('checkout.city')}</label>
                            <input 
                                required 
                                name="city" 
                                value={formData.city} 
                                onChange={handleChange} 
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">{t('checkout.postalCode')}</label>
                            <input 
                                required 
                                name="postalCode" 
                                value={formData.postalCode} 
                                onChange={handleChange} 
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">{t('checkout.country')}</label>
                            <input 
                                required 
                                name="country" 
                                value={formData.country} 
                                onChange={handleChange} 
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border">
                        <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                             <CreditCard className="w-5 h-5 text-accent" /> {t('checkout.paymentMethod')}
                        </h4>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 p-4 border border-accent/50 rounded-xl bg-accent/5 cursor-pointer hover:bg-accent/10 transition-colors">
                                <input 
                                    type="radio" 
                                    name="paymentMethod" 
                                    value="Cash on Delivery" 
                                    checked={formData.paymentMethod === 'Cash on Delivery'} 
                                    onChange={handleChange} 
                                    className="w-4 h-4 text-accent focus:ring-accent" 
                                />
                                <div className="flex-1">
                                    <span className="font-bold block text-foreground">{t('checkout.cashOnDelivery')}</span>
                                    <span className="text-sm text-muted-foreground">{t('checkout.payAfter')}</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </form>
            </div>

            {/* Right Column: Order Summary (Span 5) - Sticky */}
            <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-24 space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg">
                    <h3 className="text-2xl font-bold mb-6 text-foreground">{t('checkout.orderSummary')}</h3>
                    <div className="flex gap-4 mb-6">
                        <div className="w-20 h-20 bg-secondary rounded-xl overflow-hidden shadow-inner flex-shrink-0 border border-border">
                            <img 
                                src={product.image || (product.images && product.images[0]) || 'https://via.placeholder.com/150'} 
                                alt={product.name} 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-foreground mb-1 line-clamp-2">{product.name}</h4>
                            <div className="text-xl font-bold text-accent mb-2">${unitPrice}</div>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between gap-3 mb-6 bg-secondary/30 p-3 rounded-lg">
                        <label className="text-sm font-medium text-muted-foreground">{t('checkout.quantity')}:</label>
                        <div className="flex items-center border border-border rounded-lg bg-background">
                            <button 
                                type="button"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-3 py-1 hover:bg-accent/10 text-foreground transition-colors"
                            >-</button>
                            <input 
                                type="number" 
                                min="1" 
                                value={quantity} 
                                onChange={handleQuantityChange}
                                className="w-12 text-center bg-transparent border-none focus:ring-0 text-foreground py-1 appearance-none"
                            />
                            <button 
                                type="button"
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-3 py-1 hover:bg-accent/10 text-foreground transition-colors"
                            >+</button>
                        </div>
                    </div>

                    <div className="space-y-4 border-t border-border pt-6">
                        <div className="flex justify-between text-muted-foreground">
                            <span>{t('checkout.subtotal')}</span>
                            <span>${totalPrice}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>{t('checkout.shipping')}</span>
                            <span className="text-green-600 font-medium">{t('checkout.free')}</span>
                        </div>
                        <div className="flex justify-between pt-4 border-t border-border font-bold text-2xl text-foreground">
                            <span>{t('checkout.total')}</span>
                            <span>${totalPrice}</span>
                        </div>
                    </div>

                    <button 
                        disabled={submitting} 
                        // form="checkout-form" // Optional: allows button outside form
                        onClick={(e) => document.getElementById('checkout-form').requestSubmit()}
                        className="btn-primary w-full py-4 text-lg font-bold shadow-xl shadow-accent/20 mt-8 flex items-center justify-center gap-2 group hover:scale-[1.02] transition-transform"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> {t('checkout.processing')}
                            </>
                        ) : (
                            <>
                                {t('checkout.completeOrder')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                    
                     <div className="mt-6 flex flex-col gap-2 text-xs text-muted-foreground text-center">
                        <div className="flex items-center justify-center gap-2">
                            <ShieldCheck className="w-3 h-3 text-green-500" /> {t('checkout.sslSecure')}
                        </div>
                        <p>{t('checkout.moneyBackGuarantee')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingCheckout;
