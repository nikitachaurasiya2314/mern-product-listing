import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPage, setAdminPage } from '../features/products/productSlice';

const Pagination = ({ isAdmin = false }) => {
  const dispatch = useDispatch();
  const state    = useSelector((s) => s.products);

  const pagination  = isAdmin ? state.adminPagination  : state.pagination;
  const limit       = isAdmin ? state.adminFilters.limit : state.filters.limit;
  const onPageChange = (page) => dispatch(isAdmin ? setAdminPage(page) : setPage(page));

  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, totalCount } = pagination;

  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end   = Math.min(totalPages, currentPage + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  const from = (currentPage - 1) * limit + 1;
  const to   = Math.min(currentPage * limit, totalCount);

  return (
    <div className="flex flex-col items-center gap-3 mt-8">
      <p className="text-gray-400 text-sm">
        Showing {from}–{to} of {totalCount} products
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          ‹ Prev
        </button>

        {start > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded bg-white hover:bg-gray-50 cursor-pointer transition-colors"
            >
              1
            </button>
            <span className="text-gray-400 px-1">…</span>
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 text-sm border rounded cursor-pointer transition-colors ${
              p === currentPage
                ? 'bg-primary border-primary text-white font-bold'
                : 'border-gray-200 bg-white hover:bg-gray-50 text-dark'
            }`}
          >
            {p}
          </button>
        ))}

        {end < totalPages && (
          <>
            <span className="text-gray-400 px-1">…</span>
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded bg-white hover:bg-gray-50 cursor-pointer transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          Next ›
        </button>
      </div>
    </div>
  );
};

export default Pagination;
