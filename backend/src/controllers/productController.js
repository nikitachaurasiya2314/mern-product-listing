import {
  getProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
  getFiltersMetaService,
} from '../services/productService.js';

export const getProducts = async (req, res, next) => {
  try {
    const result = await getProductsService(req.query);
    res.status(200).json({ success: true, data: result.products, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await getProductByIdService(req.params.id);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await createProductService(req.body, req.user._id);
    res.status(201).json({ success: true, message: 'Product created successfully', data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await updateProductService(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Product updated successfully', data: product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await deleteProductService(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getFiltersMeta = async (req, res, next) => {
  try {
    const data = await getFiltersMetaService();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
