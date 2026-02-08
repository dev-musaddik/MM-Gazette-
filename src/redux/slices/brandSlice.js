import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/apiService';

// Async Thunks
export const fetchBrands = createAsyncThunk(
  'brands/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/brands');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch brands');
    }
  }
);

export const createBrand = createAsyncThunk(
  'brands/createBrand',
  async (brandData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/brands', brandData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create brand');
    }
  }
);

export const updateBrand = createAsyncThunk(
  'brands/updateBrand',
  async ({ id, brandData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/brands/${id}`, brandData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update brand');
    }
  }
);

export const deleteBrand = createAsyncThunk(
  'brands/deleteBrand',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/brands/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete brand');
    }
  }
);

const brandSlice = createSlice({
  name: 'brands',
  initialState: {
    brands: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBrandError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Brands
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Brand
      .addCase(createBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands.push(action.payload);
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Brand
      .addCase(updateBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.brands.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Brand
      .addCase(deleteBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = state.brands.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBrandError } = brandSlice.actions;
export default brandSlice.reducer;
