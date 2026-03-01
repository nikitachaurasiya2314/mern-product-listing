import React from 'react';

const StarRating = ({ rating }) => {
  const full  = Math.floor(rating);
  const empty = 5 - full;
  return (
    <span className="text-sm">
      <span className="text-yellow-400">{'★'.repeat(full)}</span>
      <span className="text-gray-300">{'☆'.repeat(empty)}</span>
      <span className="text-gray-400 text-xs ml-1">({Number(rating).toFixed(1)})</span>
    </span>
  );
};

const ProductCard = ({ product, onEdit, onDelete, isAdmin }) => {
  const inStock = product.stock > 0;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow duration-200">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={product.images?.[0] || `https://picsum.photos/seed/${product._id}/400/300`}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=No+Image'; }}
        />
        <span
          className={`absolute top-2 right-2 text-white text-xs font-semibold px-2 py-0.5 rounded-full ${
            inStock ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {inStock ? `In Stock (${product.stock})` : 'Out of Stock'}
        </span>
      </div>

      <div className="p-4">
        <span className="text-primary text-xs font-bold uppercase tracking-wide">
          {product.category}
        </span>

        <h3 className="text-dark font-bold text-sm mt-1 leading-snug line-clamp-2">
          {product.name}
        </h3>

        <p className="text-gray-400 text-xs mt-0.5 mb-2">by {product.brand}</p>

        <StarRating rating={product.rating || 0} />

        <div className="flex items-center justify-between mt-3">
          <span className="text-dark font-extrabold text-lg">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>

          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(product)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded cursor-pointer border-0 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(product._id)}
                className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded cursor-pointer border-0 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
