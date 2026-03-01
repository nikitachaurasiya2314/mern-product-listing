import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProducts, deleteProduct } from '../features/products/productSlice';
import ProductCard from '../components/ProductCard';
import ProductFormModal from '../components/ProductFormModal';
import Pagination from '../components/Pagination';
import { toast } from 'react-toastify';

const AdminPage = () => {
  const dispatch = useDispatch();
  const { adminProducts, adminPagination, adminLoading, adminFilters } = useSelector((s) => s.products);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditing] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminProducts({ ...adminFilters }));
  }, [dispatch, adminFilters.page]);

  const handleEdit  = (p) => { setEditing(p); setShowModal(true); };
  const handleClose = () => { setShowModal(false); setEditing(null); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success('Product deleted!');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 py-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-dark font-bold text-2xl">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage your product catalogue</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer border-0"
        >
          + Add Product
        </button>
      </div>

      {adminPagination && (
        <div className="flex gap-4 mb-6">
          <div className="bg-white rounded-xl px-6 py-4 shadow text-center min-w-[100px]">
            <p className="text-primary font-extrabold text-3xl">{adminPagination.totalCount}</p>
            <p className="text-gray-400 text-xs mt-0.5">Total Products</p>
          </div>
          <div className="bg-white rounded-xl px-6 py-4 shadow text-center min-w-[100px]">
            <p className="text-primary font-extrabold text-3xl">{adminPagination.totalPages}</p>
            <p className="text-gray-400 text-xs mt-0.5">Pages</p>
          </div>
        </div>
      )}

      {adminLoading ? (
        <div className="flex justify-center items-center min-h-60">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {adminProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isAdmin
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
          <Pagination isAdmin />
        </>
      )}

      {showModal && <ProductFormModal product={editingProduct} onClose={handleClose} />}
    </div>
  );
};

export default AdminPage;
