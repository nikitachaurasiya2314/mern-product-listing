import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

const buildCleanParams = (filters) => {
  const p = {};

  if (filters.search?.trim()) p.search = filters.search.trim();
  if (filters.category?.length > 0) p.category = filters.category.join(',');
  if (filters.minPrice !== '' && !isNaN(Number(filters.minPrice))) p.minPrice = Number(filters.minPrice);
  if (filters.maxPrice !== '' && !isNaN(Number(filters.maxPrice))) p.maxPrice = Number(filters.maxPrice);
  if (filters.minRating !== '' && Number(filters.minRating) > 0) p.minRating = Number(filters.minRating);

  p.sort  = filters.sort  || 'newest';
  p.page  = filters.page  || 1;
  p.limit = filters.limit || 12;

  return p;
};

const defaultFilters = {
  search:    '',
  category:  [],
  minPrice:  '',
  maxPrice:  '',
  minRating: '',
  sort:      'newest',
  page:      1,
  limit:     12,
};

export const fetchProducts = createAsyncThunk('products/fetchAll', async (filters, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products', { params: buildCleanParams(filters) });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
  }
});

export const fetchAdminProducts = createAsyncThunk('products/fetchAdmin', async (filters, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products', { params: buildCleanParams(filters) });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
  }
});

export const fetchFiltersMeta = createAsyncThunk('products/fetchMeta', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/filters/meta');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch filters');
  }
});

export const fetchProductById = createAsyncThunk('products/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/products/${id}`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Product not found');
  }
});

export const createProduct = createAsyncThunk('products/create', async (productData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/products', productData);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create product');
  }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, productData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/products/${id}`, productData);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update product');
  }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/products/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete product');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products:        [],
    pagination:      null,
    filters:         { ...defaultFilters },
    adminProducts:   [],
    adminPagination: null,
    adminFilters:    { ...defaultFilters },
    selectedProduct: null,
    filtersMeta: {
      categories: [],
      brands:     [],
      priceRange: { minPrice: 0, maxPrice: 5000 },
    },
    loading:       false,
    adminLoading:  false,
    detailLoading: false,
    error:         null,
  },

  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setSearch(state, action) {
      state.filters.search = action.payload;
      state.filters.page   = 1;
    },
    setPage(state, action) {
      state.filters.page = action.payload;
    },
    resetFilters(state) {
      state.filters = { ...defaultFilters };
    },
    setAdminPage(state, action) {
      state.adminFilters.page = action.payload;
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading    = false;
        state.products   = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchAdminProducts.pending,   (state) => { state.adminLoading = true; })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.adminLoading    = false;
        state.adminProducts   = action.payload.data;
        state.adminPagination = action.payload.pagination;
      })
      .addCase(fetchAdminProducts.rejected,  (state, action) => { state.adminLoading = false; state.error = action.payload; })

      .addCase(fetchFiltersMeta.fulfilled, (state, action) => { state.filtersMeta = action.payload; })

      .addCase(fetchProductById.pending,   (state) => { state.detailLoading = true; state.selectedProduct = null; })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.detailLoading = false; state.selectedProduct = action.payload; })
      .addCase(fetchProductById.rejected,  (state, action) => { state.detailLoading = false; state.error = action.payload; })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.adminProducts.unshift(action.payload);
        if (state.adminPagination) state.adminPagination.totalCount += 1;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.adminProducts.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.adminProducts[idx] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.adminProducts = state.adminProducts.filter((p) => p._id !== action.payload);
        if (state.adminPagination) state.adminPagination.totalCount -= 1;
      });
  },
});

export const { setFilters, setSearch, setPage, resetFilters, setAdminPage, clearSelectedProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
