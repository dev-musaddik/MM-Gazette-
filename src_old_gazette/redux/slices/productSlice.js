import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/apiService';

/**
 * Async thunk for fetching all products
 */
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ category, search, featured, brand, minPrice, maxPrice, availability } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      if (featured) params.append('featured', 'true');
      if (brand) params.append('brand', brand);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (availability) params.append('availability', availability);

      const { data } = await api.get(`/api/products?${params.toString()}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

/**
 * Async thunk for fetching single product
 */
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/products/${productId}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

/**
 * Async thunk for creating product (admin)
 */
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/products', productData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

/**
 * Async thunk for updating product (admin)
 */
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/products/${productId}`, productData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

/**
 * Async thunk for deleting product (admin)
 */
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/products/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

/**
 * Async thunk for creating product review
 */
export const createProductReview = createAsyncThunk(
  'products/createProductReview',
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      await api.post(`/api/products/${productId}/reviews`, reviewData);
      return { productId }; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create review');
    }
  }
);

// Initial state
const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
  filters: {
    category: null,
    search: '',
    brand: null,
    minPrice: 0,
    maxPrice: 500000,
    availability: [],
  },
};

/**
 * Products slice
 */
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { 
        category: null, 
        search: '',
        brand: null,
        minPrice: 0,
        maxPrice: 500000,
        availability: []
      };
    },
    clearProductError: (state) => {
      state.error = null;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch Product By ID
    builder.addCase(fetchProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedProduct = action.payload;
    });
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Create Product
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products.unshift(action.payload);
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update Product
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.products.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      if (state.selectedProduct?._id === action.payload._id) {
        state.selectedProduct = action.payload;
      }
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete Product
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products = state.products.filter(p => p._id !== action.payload);
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Create Product Review
    builder.addCase(createProductReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProductReview.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(createProductReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { setFilters, clearFilters, clearProductError, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
