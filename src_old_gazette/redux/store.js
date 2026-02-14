import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import articleReducer from './slices/articleSlice';
import categoryReducer from './slices/categorySlice';
import brandReducer from './slices/brandSlice';
import orderReducer from './slices/orderSlice';

/**
 * Redux store configuration
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    articles: articleReducer,
    categories: categoryReducer,
    brands: brandReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
