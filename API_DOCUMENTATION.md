# API Documentation — ShopMERN

**Base URL (Local):** `http://localhost:5000/api`  
**Base URL (Production):** `https://mernproductlisting.vercel.app/api`

---

## 🔐 Authentication

### Register User
```
POST /api/auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
> Note: `role` is always set to `user` by the server. Admin accounts are only created via the seeder script.

**Success Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response `400` — Validation:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Valid email is required" }
  ]
}
```

**Error Response `409` — Email already exists:**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---

### Login User
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response `401`:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

**Success Response `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📦 Products

### Get All Products (Filters + Sort + Pagination)
```
GET /api/products
```

**Query Parameters:**

| Parameter  | Type    | Default  | Description                                           |
|------------|---------|----------|-------------------------------------------------------|
| search     | string  | —        | Regex search on name, brand, category                 |
| category   | string  | —        | Comma-separated: `Electronics,Books`                  |
| brand      | string  | —        | Comma-separated: `Apple,Samsung`                      |
| minPrice   | number  | —        | Minimum price in ₹                                    |
| maxPrice   | number  | —        | Maximum price in ₹                                    |
| minRating  | number  | —        | Rating ≥ value (1–5)                                  |
| inStock    | boolean | —        | `true` = only show items with stock > 0               |
| sort       | string  | newest   | `newest` `price_asc` `price_desc` `top_rated`         |
| page       | number  | 1        | Page number                                           |
| limit      | number  | 12       | Items per page (max: 50)                              |

**Example Requests:**
```
GET /api/products
GET /api/products?search=apple
GET /api/products?category=Electronics&sort=price_asc&page=1
GET /api/products?brand=Nike,Adidas&minPrice=999&maxPrice=9999
GET /api/products?minRating=4&inStock=true&sort=top_rated
GET /api/products?category=Electronics,Books&brand=Apple&minPrice=4999&sort=price_asc&page=2&limit=12
```

**Success Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Apple Product 1",
      "description": "High-quality electronics product from Apple.",
      "price": 79999,
      "category": "Electronics",
      "brand": "Apple",
      "stock": 45,
      "rating": 4.5,
      "numReviews": 120,
      "images": ["https://picsum.photos/seed/1/400/300"],
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "totalCount": 50,
    "totalPages": 5,
    "currentPage": 1,
    "limit": 12,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### Get Filter Metadata
```
GET /api/products/filters/meta
```
> Must be called before `GET /api/products/:id` in the routes (it is — verified)

**Success Response `200`:**
```json
{
  "success": true,
  "data": {
    "categories": ["Beauty", "Books", "Clothing", "Electronics", "Home & Garden", "Sports", "Toys"],
    "brands": ["Adidas", "Apple", "Canon", "Dell", "HP", "LG", "Nike", "Puma", "Samsung", "Sony"],
    "priceRange": {
      "minPrice": 99,
      "maxPrice": 149999
    }
  }
}
```

---

### Get Single Product
```
GET /api/products/:id
```

**Success Response `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Apple Product 1",
    "price": 79999,
    "category": "Electronics",
    "brand": "Apple",
    "stock": 45,
    "rating": 4.5,
    ...
  }
}
```

**Error Response `404`:**
```json
{
  "success": false,
  "message": "Product not found"
}
```

**Error Response `400` — Invalid ID format:**
```json
{
  "success": false,
  "message": "Invalid product ID"
}
```

---

### Create Product *(Admin only)*
```
POST /api/products
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Samsung Galaxy S24",
  "description": "Latest Samsung flagship with advanced AI features.",
  "price": 79999,
  "category": "Electronics",
  "brand": "Samsung",
  "stock": 50,
  "rating": 4.7,
  "images": ["https://picsum.photos/seed/101/400/300"]
}
```

**Required fields:** `name`, `description`, `price`, `category`, `brand`, `stock`  
**Optional fields:** `rating`, `images`

**Success Response `201`:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "65f1a2b3c4d5e6f7a8b9c0d2",
    "name": "Samsung Galaxy S24",
    "price": 79999,
    ...
  }
}
```

**Error Response `401` — No token:**
```json
{
  "success": false,
  "message": "Not authorized. Token missing."
}
```

**Error Response `403` — Not admin:**
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

---

### Update Product *(Admin only)*
```
PUT /api/products/:id
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Body** (all fields optional — send only what you want to update):
```json
{
  "price": 72999,
  "stock": 30
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": { ...updatedProduct }
}
```

---

### Delete Product *(Admin only)*
```
DELETE /api/products/:id
Authorization: Bearer <admin-token>
```
> Soft delete — sets `isActive: false`. Product is hidden from all public queries.

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## ⚠️ Error Reference

| Status | Meaning                                    |
|--------|--------------------------------------------|
| 400    | Bad request / Validation failed            |
| 401    | Unauthorized — missing or invalid token    |
| 403    | Forbidden — logged in but not admin        |
| 404    | Resource not found                         |
| 409    | Conflict — email already registered        |
| 500    | Internal server error                      |

---

## 📋 Product Schema Reference

| Field       | Type       | Required | Validation                          |
|-------------|------------|----------|-------------------------------------|
| name        | String     | ✅        | 2–200 characters                    |
| description | String     | ✅        | max 2000 characters                 |
| price       | Number     | ✅        | >= 0 (in ₹)                         |
| category    | String     | ✅        | Enum: Electronics, Clothing, Books, Home & Garden, Sports, Toys, Beauty, Automotive, Food, Other |
| brand       | String     | ✅        | Non-empty                           |
| stock       | Number     | ✅        | Integer >= 0                        |
| rating      | Number     | ❌        | 0–5 (default: 0)                    |
| numReviews  | Number     | ❌        | default: 0                          |
| images      | [String]   | ❌        | Array of image URLs                 |
| isActive    | Boolean    | ❌        | default: true (false = soft-deleted)|
| createdAt   | Date       | Auto     | Mongoose timestamps                 |
| updatedAt   | Date       | Auto     | Mongoose timestamps                 |

---

## 🧪 Postman Setup

1. Create collection: **ShopMERN API**
2. Add collection variable: `baseUrl` = `http://localhost:5000/api`
3. After login, copy the token value
4. Add collection variable: `token` = paste token here
5. For all protected routes, add header:
   ```
   Authorization: Bearer {{token}}
   ```

### Quick Test Sequence
```
1. POST {{baseUrl}}/auth/login        → get token → set {{token}}
2. GET  {{baseUrl}}/products           → see all products
3. GET  {{baseUrl}}/products/filters/meta → see filter options
4. GET  {{baseUrl}}/products?search=apple&sort=price_asc
5. POST {{baseUrl}}/products           → create (needs admin token)
6. PUT  {{baseUrl}}/products/:id       → update (needs admin token)
7. DELETE {{baseUrl}}/products/:id     → delete (needs admin token)
```
