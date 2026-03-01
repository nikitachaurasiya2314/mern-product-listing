# ShopMERN — Product Listing System

A full-stack e-commerce product listing application built with the MERN stack. Includes JWT-based authentication, role-based access control, server-side filtering and pagination, and an admin panel for managing products.

**Live Demo:** https://mernfrontend-five.vercel.app  
**API:** https://mernproductlisting.vercel.app/api/health

---

## Tech Stack

| Layer      | Technology                                        |
|------------|---------------------------------------------------|
| Frontend   | React 18 (Vite), Redux Toolkit, Tailwind CSS      |
| Backend    | Node.js, Express.js                               |
| Database   | MongoDB Atlas, Mongoose                           |
| Auth       | JWT, bcryptjs                                     |
| HTTP       | Axios                                             |
| Routing    | React Router v6                                   |
| Deployment | Vercel                                            |

---

## Features

- User registration and login with JWT authentication
- Role-based access control — `admin` and `user` roles
- Product listing with responsive grid layout
- Live debounced search across product name, brand, and category
- Server-side filters: Category, Price Range, Rating
- Sort by newest, price (low to high / high to low), or rating
- Server-side pagination with total count
- Admin panel — create, edit, and delete products
- Protected routes — `/admin` accessible to admins only
- Auto logout on token expiry via Axios interceptor

---

## Project Structure

```
ProductList/
├── backend/
│   ├── src/
│   │   ├── config/         # MongoDB connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # JWT helper, AppError, seeder
│   │   └── server.js
│   ├── vercel.json
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/            # Axios instance with interceptors
    │   ├── app/            # Redux store
    │   ├── components/     # Reusable UI components
    │   ├── features/       # Auth and product Redux slices
    │   ├── pages/          # Page components
    │   └── App.jsx
    ├── vercel.json
    └── vite.config.js
```

---

## Local Setup

**Prerequisites:** Node.js v18+, MongoDB Atlas account

### 1. Clone the repository

```bash
git clone https://github.com/nikitachaurasiya2314/mern-product-listing.git
cd mern-product-listing
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/shopMERN
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

```bash
npm run seed    # creates 50 products + 2 user accounts
npm run dev     # starts server on http://localhost:5000
```

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev     # starts on http://localhost:3000
```

---

## Demo Credentials

| Role  | Email             | Password |
|-------|-------------------|----------|
| Admin | admin@example.com | admin123 |
| User  | user@example.com  | user1234 |

> Admin accounts can only be created via `npm run seed`. The register endpoint always assigns the `user` role.

---

## API Endpoints

### Auth

| Method | Endpoint           | Access  | Description          |
|--------|--------------------|---------|----------------------|
| POST   | /api/auth/register | Public  | Register a new user  |
| POST   | /api/auth/login    | Public  | Login                |
| GET    | /api/auth/me       | Private | Get current user     |

### Products

| Method | Endpoint                   | Access     | Description                    |
|--------|----------------------------|------------|--------------------------------|
| GET    | /api/products              | Public     | List products with filters     |
| GET    | /api/products/filters/meta | Public     | Get categories and price range |
| GET    | /api/products/:id          | Public     | Get a single product           |
| POST   | /api/products              | Admin only | Create a product               |
| PUT    | /api/products/:id          | Admin only | Update a product               |
| DELETE | /api/products/:id          | Admin only | Delete a product               |

### Query parameters — `GET /api/products`

| Param     | Example                 | Description                                      |
|-----------|-------------------------|--------------------------------------------------|
| search    | `?search=samsung`       | Search across name, brand, and category          |
| category  | `?category=Electronics` | Comma-separated values                           |
| minPrice  | `?minPrice=999`         | Minimum price in ₹                               |
| maxPrice  | `?maxPrice=49999`       | Maximum price in ₹                               |
| minRating | `?minRating=4`          | Products with rating greater than or equal to    |
| sort      | `?sort=price_asc`       | newest / price_asc / price_desc / top_rated      |
| page      | `?page=2`               | Page number — default: 1                         |
| limit     | `?limit=12`             | Results per page — default: 12, max: 50          |

---

## Scripts

**Backend**

| Command              | Description                        |
|----------------------|------------------------------------|
| `npm run dev`        | Start development server (nodemon) |
| `npm start`          | Start production server            |
| `npm run seed`       | Seed database with sample data     |
| `npm run seed:destroy` | Clear all data from database     |

**Frontend**

| Command           | Description                    |
|-------------------|--------------------------------|
| `npm run dev`     | Start development server       |
| `npm run build`   | Build for production           |
| `npm run preview` | Preview production build       |

---

## Deployment

Frontend and backend are deployed on Vercel. Database is hosted on MongoDB Atlas.

**Backend environment variables:** `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `NODE_ENV`, `CLIENT_URL`

**Frontend environment variables:** `VITE_API_URL`
