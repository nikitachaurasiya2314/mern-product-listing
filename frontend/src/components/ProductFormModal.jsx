import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createProduct, updateProduct } from '../features/products/productSlice';
import { toast } from 'react-toastify';

const CATEGORIES = [
  'Electronics', 'Clothing', 'Books', 'Home & Garden',
  'Sports', 'Toys', 'Beauty', 'Automotive', 'Food', 'Other',
];

const defaultForm = {
  name: '', description: '', price: '', category: 'Electronics',
  brand: '', stock: '', rating: '', images: '',
};

const ProductFormModal = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const [form, setForm]       = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        images: product.images?.join(', ') || '',
        rating: product.rating || '',
      });
    } else {
      setForm(defaultForm);
    }
  }, [product]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      price:  Number(form.price),
      stock:  Number(form.stock),
      rating: Number(form.rating) || 0,
      images: form.images ? form.images.split(',').map((s) => s.trim()) : [],
    };
    try {
      if (product) {
        await dispatch(updateProduct({ id: product._id, productData: payload })).unwrap();
        toast.success('Product updated!');
      } else {
        await dispatch(createProduct(payload)).unwrap();
        toast.success('Product created!');
      }
      onClose();
    } catch (err) {
      toast.error(err || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-dark font-bold text-xl mb-5">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Product Name *</label>
              <input
                name="name" value={form.name} onChange={handleChange} required
                placeholder="Product name"
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Brand *</label>
              <input
                name="brand" value={form.brand} onChange={handleChange} required
                placeholder="e.g. Apple, Nike"
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Category *</label>
              <select
                name="category" value={form.category} onChange={handleChange}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary bg-white"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Price (₹) *</label>
              <input
                name="price" type="number" min="0" step="1"
                value={form.price} onChange={handleChange} required placeholder="e.g. 49999"
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Stock *</label>
              <input
                name="stock" type="number" min="0"
                value={form.stock} onChange={handleChange} required placeholder="0"
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Rating (0–5)</label>
              <input
                name="rating" type="number" min="0" max="5" step="0.1"
                value={form.rating} onChange={handleChange} placeholder="0.0"
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Description *</label>
            <textarea
              name="description" value={form.description} onChange={handleChange} required
              rows={3} placeholder="Product description"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Image URL</label>
            <input
              name="images" value={form.images} onChange={handleChange}
              placeholder="https://example.com/product.jpg"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
            />
            <p className="text-xs text-gray-400 mt-0.5">
              💡 Tip: Use any direct image URL. Free images: picsum.photos/400/300
            </p>
            {form.images && form.images.trim() !== '' && (
              <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden h-32 bg-gray-50">
                <img
                  src={form.images.split(',')[0].trim()}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div
                  className="hidden w-full h-full items-center justify-center text-gray-400 text-xs"
                  style={{ display: 'none' }}
                >
                   Invalid image URL
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-1">
            <button
              type="button" onClick={onClose}
              className="px-5 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 cursor-pointer bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:opacity-90 disabled:opacity-60 cursor-pointer border-0 transition-opacity"
            >
              {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
