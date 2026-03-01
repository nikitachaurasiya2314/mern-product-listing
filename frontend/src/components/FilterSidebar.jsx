import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, resetFilters, fetchFiltersMeta } from '../features/products/productSlice';

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const { filters, filtersMeta } = useSelector((state) => state.products);
  const [localFilters, setLocal] = useState(filters);

  useEffect(() => { dispatch(fetchFiltersMeta()); }, [dispatch]);
  useEffect(() => { setLocal(filters); }, [filters]);

  const handleCheckbox = (field, value) => {
    const current = localFilters[field];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setLocal((prev) => ({ ...prev, [field]: updated }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocal((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => dispatch(setFilters(localFilters));
  const handleReset  = () => dispatch(resetFilters());

  const { categories } = filtersMeta;

  return (
    <aside className="w-56 min-w-[210px] bg-white rounded-xl p-5 shadow sticky top-20 h-fit">

      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-dark font-bold text-base">Filters</h3>
        <button
          onClick={handleReset}
          className="text-primary border border-primary text-xs px-2.5 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer bg-transparent"
        >
          Reset
        </button>
      </div>

      <div className="mb-4 pb-4 border-b border-gray-100">
        <h4 className="text-gray-500 font-semibold text-xs uppercase tracking-wide mb-2">Category</h4>
        <div className="flex flex-col gap-1.5">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="accent-primary"
                checked={localFilters.category.includes(cat)}
                onChange={() => handleCheckbox('category', cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4 pb-4 border-b border-gray-100">
        <h4 className="text-gray-500 font-semibold text-xs uppercase tracking-wide mb-2">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            name="minPrice"
            type="number"
            placeholder="₹ Min"
            value={localFilters.minPrice}
            onChange={handleChange}
            className="w-20 px-2 py-1.5 border border-gray-200 rounded text-xs outline-none focus:border-primary"
          />
          <span className="text-gray-400 text-xs">–</span>
          <input
            name="maxPrice"
            type="number"
            placeholder="₹ Max"
            value={localFilters.maxPrice}
            onChange={handleChange}
            className="w-20 px-2 py-1.5 border border-gray-200 rounded text-xs outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="mb-5">
        <h4 className="text-gray-500 font-semibold text-xs uppercase tracking-wide mb-2">Min Rating</h4>
        <div className="flex flex-col gap-1.5">
          {[4, 3, 2, 1].map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="radio"
                name="minRating"
                value={r}
                className="accent-primary"
                checked={Number(localFilters.minRating) === r}
                onChange={handleChange}
              />
              <span className="text-yellow-400">{'★'.repeat(r)}</span>
              <span className="text-gray-500 text-xs">& above</span>
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="radio"
              name="minRating"
              value=""
              className="accent-primary"
              checked={!localFilters.minRating}
              onChange={handleChange}
            />
            All Ratings
          </label>
        </div>
      </div>

      <button
        onClick={applyFilters}
        className="w-full bg-primary hover:opacity-90 text-white font-bold py-2.5 rounded-lg text-sm transition-opacity cursor-pointer border-0"
      >
        Apply Filters
      </button>
    </aside>
  );
};

export default FilterSidebar;
