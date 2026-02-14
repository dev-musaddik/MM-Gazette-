import { Star, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Pool of generic, high-quality reviews (English)
const REVIEW_POOL_EN = [
    { name: "Sarah M.", text: "Absolutely exactly what I needed. The quality is outstanding and the delivery was instant." },
    { name: "Michael T.", text: "I was skeptical at first, but this exceeded my expectations. diverse and high quality." },
    { name: "Jessica R.", text: "Great value for the price. Support was also very helpful when I had a question." },
    { name: "David K.", text: "Highly recommended! Saved me so much time and effort." },
    { name: "Emily W.", text: "Professional, reliable, and top-notch quality. Will definitely buy again." },
    { name: "James L.", text: "Five stars! The attention to detail is impressive." },
    { name: "Ashley B.", text: "Smooth transaction and excellent product. Very happy with my purchase." },
    { name: "Robert P.", text: "Exactly as described. Works perfectly for my needs." },
    { name: "Jennifer H.", text: "Superb experience. efficient and professional." },
    { name: "William S.", text: "I've tried similar services, but this one is by far the best." }
];

// Pool of generic, high-quality reviews (Bangla)
const REVIEW_POOL_BN = [
    { name: "সারা এম.", text: "ঠিক যা চেয়েছিলাম তাই পেয়েছি। গুণমান অসাধারণ এবং খুব দ্রুত পেয়েছি।" },
    { name: "মাইকেল টি.", text: "প্রথমে সন্দেহ ছিল, কিন্তু এটি আমার প্রত্যাশা ছাড়িয়ে গেছে। খুবই উন্নত মানের।" },
    { name: "জেসিকা আর.", text: "দামের তুলনায় খুবই ভালো। আমার প্রশ্নের খুব সুন্দর উত্তর পেয়েছি সাপোর্টের কাছ থেকে।" },
    { name: "ডেভিড কে.", text: "খুবই ভালো! আমার অনেক সময় এবং শ্রম বাঁচিয়েছে।" },
    { name: "এমিলি ডব্লিউ.", text: "পেশাদার, নির্ভরযোগ্য এবং সেরা মানের। অবশ্যই আবার কিনব।" },
    { name: "জেমস এল.", text: "ফাইভ স্টার! খুঁটিনাটি বিষয়গুলোর দিকে তাদের নজর সত্যিই প্রশংসনীয়।" },
    { name: "অ্যাশলি বি.", text: "খুব সহজে কেনাকাটা করেছি এবং প্রোডাক্টটি চমৎকার। আমি খুবই খুশি।" },
    { name: "রবার্ট পি.", text: "ঠিক বর্ণনার মতোই। আমার কাজের জন্য একদম পারফেক্ট।" },
    { name: "জেনিফার এইচ.", text: "অসাধারণ অভিজ্ঞতা। দক্ষ এবং পেশাদার।" },
    { name: "উইলিয়াম এস.", text: "আমি এরকম আরও অনেক সার্ভিস ব্যবহার করেছি, কিন্তু এটিই সেরা।" }
];

const ReviewsSection = ({ landingPageId }) => {
    const { t, i18n } = useTranslation();

    // Simple deterministic random function based on string seed
    const getSeededRandom = (seed) => {
        let h = 0xdeadbeef;
        for (let i = 0; i < seed.length; i++) {
            h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
        }
        return ((h ^ h >>> 9) >>> 0) / 4294967296;
    };

    // Shuffle and select 3 reviews based on landingPageId
    const getReviewsForPage = () => {
        const pool = i18n.language === 'bn' ? REVIEW_POOL_BN : REVIEW_POOL_EN;
        if (!landingPageId) return pool.slice(0, 3);
        
        // Create a copy to shuffle
        let shuffled = [...pool];
        const seedBase = landingPageId.toString();

        // Fisher-Yates shuffle with seeded random
        for (let i = shuffled.length - 1; i > 0; i--) {
            const random = getSeededRandom(seedBase + i);
            const j = Math.floor(random * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled.slice(0, 3);
    };

    const reviews = getReviewsForPage();

    return (
        <div className="py-24 bg-secondary/30 border-y border-border">
            <div className="container-custom">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="flex items-center justify-center gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                        ))}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-foreground">
                        {t('reviews.trustedBy')}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        {t('reviews.dontTakeWord')}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <div key={index} className="bg-background border border-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-muted-foreground mb-6 italic">"{review.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center font-bold text-accent">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-foreground text-sm">{review.name}</div>
                                    <div className="text-xs text-green-600 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> {t('reviews.verifiedPurchase')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewsSection;
