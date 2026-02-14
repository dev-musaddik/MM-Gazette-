import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/apiService';

// Fetch all articles
export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (filters = {}, thunkAPI) => {
    try {
      let query = '?';
      if (filters && filters.category) query += `category=${filters.category}&`;
      if (filters && filters.tag) query += `tag=${filters.tag}&`;
      
      const response = await api.get('/api/articles' + query);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Fetch single article by slug
export const fetchArticleBySlug = createAsyncThunk(
  'articles/fetchArticleBySlug',
  async (slug, thunkAPI) => {
    try {
      const response = await api.get(`/api/articles/${slug}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const articleSlice = createSlice({
  name: 'articles',
  initialState: {
    articles: [],
    selectedArticle: null,
    loading: false,
    error: null,
    filters: {
      category: null,
      tag: null,
    },
  },
  reducers: {
    setArticleFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedArticle: (state) => {
      state.selectedArticle = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Articles
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.data;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Article By Slug
      .addCase(fetchArticleBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticleBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedArticle = action.payload.data;
      })
      .addCase(fetchArticleBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setArticleFilters, clearSelectedArticle } = articleSlice.actions;
export default articleSlice.reducer;
