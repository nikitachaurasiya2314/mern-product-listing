import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setFilters, setSearch } from '../features/products/productSlice';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'top_rated',  label: 'Top Rated' },
];

const DEBOUNCE_DELAY = 400;

const ProductListingPage = () => {
  const dispatch = useDispatch();
  const { products, pagination, loading, error, filters } = useSelector((s) => s.products);
  const [searchInput, setSearchInput] = useState(filters.search);
  const isExternalReset = useRef(false);

  useEffect(() => {
    isExternalReset.current = true;
    setSearchInput(filters.search);
  }, [filters.search]);

  useEffect(() => {
    if (isExternalReset.current) {
      isExternalReset.current = false;
      return;
    }
    const timer = setTimeout(() => dispatch(setSearch(searchInput)), DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [searchInput, dispatch]);

  const loadProducts = useCallback(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  return (
    <div className="max-w-7xl mx-auto px-5 py-6">
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[220px] relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="🔍 Search products..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary bg-white pr-8"
          />
          {loading && searchInput && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
          )}
          {searchInput && !loading && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none bg-transparent border-0 cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        <select
          value={filters.sort}
          onChange={(e) => dispatch(setFilters({ sort: e.target.value }))}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white cursor-pointer focus:border-primary"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-6 items-start">
        <FilterSidebar />
        <main className="flex-1 min-w-0">
          {pagination && (
            <p className="text-gray-400 text-sm mb-4">
              {pagination.totalCount} product{pagination.totalCount !== 1 ? 's' : ''} found
            </p>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-72 gap-3">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Loading products...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-72 gap-3">
              <p className="text-red-500">❌ {error}</p>
              <button onClick={loadProducts} className="px-5 py-2 bg-primary text-white rounded-lg text-sm cursor-pointer border-0 hover:opacity-90">
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-72 gap-2">
              <span className="text-5xl">🔍</span>
              <p className="text-gray-400 text-sm">No products match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} isAdmin={false} />
              ))}
            </div>
          )}

          <Pagination />
        </main>
      </div>
    </div>
  );
};

export default ProductListingPage;
