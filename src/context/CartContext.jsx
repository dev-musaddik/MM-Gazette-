import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);

    // Initialize
    useEffect(() => {
        const user = localStorage.getItem('userInfo');
        if (user) {
            const parsedUser = JSON.parse(user);
            setUserInfo(parsedUser);
            fetchUserCart(parsedUser);
        } else {
            // Load from local storage for guests
            const localCart = localStorage.getItem('guestCart');
            if (localCart) {
                setCart(JSON.parse(localCart));
            }
            setLoading(false);
        }
    }, []);

    // Sync guest cart to local storage whenever it changes
    useEffect(() => {
        if (!userInfo) {
            localStorage.setItem('guestCart', JSON.stringify(cart));
        }
    }, [cart, userInfo]);

    const fetchUserCart = async (user) => {
        try {
            const res = await fetch('/api/cart', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            
            if (res.status === 401) {
                localStorage.removeItem('userInfo');
                setUserInfo(null);
                setCart([]);
                return;
            }

            const data = await res.json();
            if (res.ok) {
                // Backend returns { items: [...] } usually
                setCart(data.data?.items || []);
            }
        } catch (err) {
            console.error("Failed to fetch cart", err);
            if (err.message && err.message.includes('401')) { // Basic check, better if we check res.status
                 localStorage.removeItem('userInfo');
                 setUserInfo(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product, quantity = 1) => {
        // Construct item object
        const item = {
            product: product._id,
            name: product.name,
            price: product.basePrice,
            image: product.image,
            quantity
        };

        if (userInfo) {
            // API call for logged in user
            try {
                const res = await fetch('/api/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userInfo.token}`
                    },
                    body: JSON.stringify({ productId: product._id, quantity })
                });
                const data = await res.json();
                if (res.ok) {
                    setCart(data.data.items);
                    return true;
                }
            } catch (err) {
                console.error("Add to cart error", err);
                return false;
            }
        } else {
            // Local state for guest
            setCart(prev => {
                const existing = prev.find(i => i.product === product._id);
                if (existing) {
                    return prev.map(i => i.product === product._id 
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                    );
                }
                return [...prev, item];
            });
            return true;
        }
    };

    const removeFromCart = async (productId) => {
        if (userInfo) {
            try {
                const res = await fetch(`/api/cart/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${userInfo.token}`
                    }
                });
                const data = await res.json();
                if (res.ok) {
                    setCart(data.data.items);
                }
            } catch (err) {
                console.error("Remove from cart error", err);
            }
        } else {
            setCart(prev => prev.filter(item => item.product !== productId));
        }
    };

    const clearCart = async () => {
        if (userInfo) {
             try {
                await fetch('/api/cart', {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${userInfo.token}` }
                });
                setCart([]);
            } catch (err) {
                console.error("Clear cart error", err);
            }
        } else {
            setCart([]);
            localStorage.removeItem('guestCart');
        }
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cart.reduce((acc, item) => {
        const price = item.price || (item.product && item.product.basePrice) || 0;
        return acc + (Number(price) * item.quantity);
    }, 0);

    return (
        <CartContext.Provider value={{ 
            cart, 
            loading, 
            addToCart, 
            removeFromCart, 
            clearCart,
            cartCount,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};
