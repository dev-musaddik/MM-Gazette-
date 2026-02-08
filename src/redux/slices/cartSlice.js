import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/apiService';

/**
 * Async thunk for fetching cart
 */
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/cart');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

/**
 * Async thunk for adding item to cart
 */
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (itemData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/cart', itemData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

/**
 * Async thunk for updating cart item
 */
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/cart/${itemId}`, { quantity });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
    }
  }
);

/**
 * Async thunk for removing item from cart
 */
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/api/cart/${itemId}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

/**
 * Async thunk for clearing cart
 */
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.delete('/api/cart');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

// Initial state
const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,
};

/**
 * Helper function to calculate cart totals
 */
const calculateTotals = (items) => {
  const total = items.reduce((sum, item) => {
    return sum + (item.product?.basePrice || 0) * item.quantity;
  }, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

/**
 * Cart slice
 */
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder.addCase(fetchCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items || [];
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Add to Cart
    builder.addCase(addToCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items || [];
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update Cart Item
    builder.addCase(updateCartItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCartItem.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items || [];
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
    });
    builder.addCase(updateCartItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Remove from Cart
    builder.addCase(removeFromCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items || [];
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Clear Cart
    builder.addCase(clearCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(clearCart.fulfilled, (state) => {
      state.loading = false;
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    });
    builder.addCase(clearCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
