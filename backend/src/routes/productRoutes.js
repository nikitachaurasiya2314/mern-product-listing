import express from 'express';
import { body } from 'express-validator';

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFiltersMeta,
} from '../controllers/productController.js';

import { protect, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

const createProductRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),

  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),

  body('category')
    .notEmpty().withMessage('Category is required'),

  body('brand')
    .trim()
    .notEmpty().withMessage('Brand is required'),

  body('stock')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

const updateProductRules = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Product name cannot be empty'),

  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('Description cannot be empty'),

  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),

  body('category')
    .optional()
    .notEmpty().withMessage('Category cannot be empty'),

  body('brand')
    .optional()
    .trim()
    .notEmpty().withMessage('Brand cannot be empty'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];


router.get('/filters/meta', getFiltersMeta);

router.get('/', getProducts);
router.get('/:id', getProductById);



router.post(
  '/',
  protect,
  authorize('admin'),
  createProductRules,
  validate,
  createProduct
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  updateProductRules,
  validate,
  updateProduct
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  deleteProduct
);

export default router;