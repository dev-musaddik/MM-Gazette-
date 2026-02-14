import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Search } from 'lucide-react';
import Seo from '../components/layout/Seo';

const OrderSuccess = () => {
    const { id } = useParams();
    // Optionally fetch order details here if needed to show dynamic "Thank you [Name]"
    
    return (
        <div className="pt-32 min-h-screen container-custom flex items-center justify-center pb-20 text-center">
            <Seo title="Order Confirmed | MM Universal" />
            
            <div className="glass-card p-12 max-w-2xl w-full border border-green-500/30 shadow-2xl shadow-green-500/10">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
                    <CheckCircle className="w-12 h-12" />
                </div>
                
                <h1 className="text-4xl font-display font-bold mb-4">Order Confirmed!</h1>
                <p className="text-slate-300 text-lg mb-8">
                    Thank you for your purchase. Your order has been placed successfully.
                </p>
                
                <div className="bg-white/5 rounded-xl p-6 mb-8 inline-block w-full max-w-sm">
                    <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Order ID</p>
                    <p className="text-xl font-mono font-bold text-accent">#{id || 'UNKNOWN'}</p>
                </div>

                <div className="space-y-4">
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">
                        We have sent a confirmation email to your inbox. Our team will contact you shortly to discuss the next steps.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/" className="btn-primary">Return Home</Link>
                        {/* If logged in user, maybe link to my orders? */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
