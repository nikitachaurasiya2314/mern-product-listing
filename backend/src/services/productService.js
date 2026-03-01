import Product from '../models/Product.js';
import mongoose from 'mongoose';
import AppError from '../utils/AppError.js';

const buildFilter = (query) => {
  const { search, category, minPrice, maxPrice, minRating } = query;

  const filter = { isActive: true };

  if (search?.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    filter.$or = [
      { name: { $regex: regex } },
      { brand: { $regex: regex } },
      { category: { $regex: regex } },
    ];
  }

  if (category?.trim()) {
    filter.category = { $in: category.split(',').map((c) => c.trim()) };
  }

  if (minPrice !== undefined && minPrice !== '' && minPrice !== null) {
    const min = Number(minPrice);
    if (!isNaN(min)) {
      filter.price = { ...filter.price, $gte: min };
    }
  }

  if (maxPrice !== undefined && maxPrice !== '' && maxPrice !== null) {
    const max = Number(maxPrice);
    if (!isNaN(max)) {
      filter.price = { ...filter.price, $lte: max };
    }
  }

  const rating = Number(minRating);
  if (!isNaN(rating) && rating > 0) {
    filter.rating = { $gte: rating };
  }

  return filter;
};

export const getProductsService = async (queryParams) => {
  const { sort, page = 1, limit = 12 } = queryParams;

  const filter = buildFilter(queryParams);

  const sortMap = {
    price_asc:  { price: 1 },
    price_desc: { price: -1 },
    newest:     { createdAt: -1 },
    top_rated:  { rating: -1 },
  };

  const sortOption = sortMap[sort] || { createdAt: -1 };
  const pageNum  = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip     = (pageNum - 1) * limitNum;

  const [products, totalCount] = await Promise.all([
    Product.find(filter).sort(sortOption).skip(skip).limit(limitNum).lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      totalCount,
      totalPages:  Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      limit:       limitNum,
      hasNextPage: pageNum * limitNum < totalCount,
      hasPrevPage: pageNum > 1,
    },
  };
};

export const getProductByIdService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid product ID', 400);
  }

  const product = await Product.findById(id).lean();

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
};

export const createProductService = async (data, userId) => {
  return await Product.create({ ...data, createdBy: userId });
};

export const updateProductService = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
};

export const deleteProductService = async (id) => {
  const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return true;
};

export const getFiltersMetaService = async () => {
  const [categories, brands, priceRange] = await Promise.all([
    Product.distinct('category', { isActive: true }),
    Product.distinct('brand',    { isActive: true }),
    Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, minPrice: { $min: '$price' }, maxPrice: { $max: '$price' } } },
    ]),
  ]);

  return {
    categories: categories.sort(),
    brands:     brands.sort(),
    priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 },
  };
};
