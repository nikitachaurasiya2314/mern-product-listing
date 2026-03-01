# 🚀 Deployment Guide — ShopMERN on Vercel

This guide deploys:
- **Backend (Express)** → Vercel Serverless Function
- **Frontend (React/Vite)** → Vercel Static Hosting
- **Database (MongoDB)** → MongoDB Atlas (already cloud-hosted)

---

## Why Vercel?

- Zero config for React + Vite
- Supports Express as Serverless Functions
- Free tier is very generous
- Single platform — both frontend + backend on same account
- Auto-deploy on every GitHub push

---

## Prerequisites

- GitHub account
- Vercel account (free) — sign up at [vercel.com](https://vercel.com)
- MongoDB Atlas cluster (you already have this)

---

## Step 1 — Prepare MongoDB Atlas for Production

Your MongoDB must allow connections from anywhere (Vercel uses dynamic IPs).

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Click your cluster → **Network Access** (left sidebar)
3. Click **Add IP Address**
4. Click **Allow Access From Anywhere** → `0.0.0.0/0`
5. Click **Confirm**

> This is required because Vercel serverless functions use dynamic IP addresses.

---

## Step 2 — Prepare Your Project for Deployment

### 2a. Add `vercel.json` to backend folder

Create `backend/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ]
}
```

### 2b. Update `backend/src/server.js` — export the app

Add `export default app;` at the very end of server.js (after `app.listen`):

```js
// At the bottom of server.js — ADD this line
export default app;
```

Vercel needs the exported app for serverless mode. The `app.listen()` still works for local dev.

### 2c. Add `frontend/vercel.json` for React Router

Create `frontend/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This is critical — without it, refreshing any page like `/admin` or `/login` gives a 404.

---

## Step 3 — Push to GitHub

```bash
# In your ProjectList root folder
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mern-product-listing.git
git push -u origin main
```

> Make sure `.gitignore` has `node_modules/` and `.env` — it already does.

---

## Step 4 — Deploy Backend to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Click **Import Git Repository** → select your repo
3. On the configure screen:
   - **Root Directory** → click Edit → type `backend`
   - **Framework Preset** → `Other`
   - **Build Command** → leave empty
   - **Output Directory** → leave empty
4. Expand **Environment Variables** → add these one by one:

   | Key | Value |
   |-----|-------|
   | `MONGO_URI` | your full Atlas connection string |
   | `JWT_SECRET` | any long random string (min 32 chars) |
   | `JWT_EXPIRE` | `7d` |
   | `NODE_ENV` | `production` |
   | `CLIENT_URL` | `https://your-frontend.vercel.app` ← add after frontend deploys |

5. Click **Deploy**
6. Wait ~1 minute → you get a URL like `https://mern-backend-xyz.vercel.app`
7. **Copy this URL** — you need it for frontend

> Test your backend: open `https://mern-backend-xyz.vercel.app/api/health` in browser → should see `{ "success": true, "message": "Server is running 🚀" }`

---

## Step 5 — Deploy Frontend to Vercel

1. Go to Vercel → **Add New Project** → select same repo again
2. On the configure screen:
   - **Root Directory** → click Edit → type `frontend`
   - **Framework Preset** → `Vite` (auto-detected)
   - **Build Command** → `npm run build`
   - **Output Directory** → `dist`
3. Expand **Environment Variables** → add:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://mern-backend-xyz.vercel.app/api` ← your backend URL from Step 4 |

4. Click **Deploy**
5. Wait ~1 minute → you get a URL like `https://mern-frontend-abc.vercel.app`

---

## Step 6 — Connect Frontend ↔ Backend (CORS)

Now go back to your **backend project** on Vercel:

1. Open backend project → **Settings** → **Environment Variables**
2. Edit `CLIENT_URL` → set it to your frontend URL:
   `https://mern-frontend-abc.vercel.app`
3. Go to **Deployments** → click the 3 dots on latest → **Redeploy**

This allows the backend to accept requests from your frontend domain.

---

## Step 7 — Seed the Production Database

Your production MongoDB is empty. Run the seeder once pointing to your Atlas URI:

```bash
cd backend

# Temporarily set your production MONGO_URI in .env
# then run:
npm run seed
```

This creates `admin@example.com` and `user@example.com` in your production database.

> After seeding, revert your local `.env` back to your local/dev MongoDB URI if needed.

---

## Step 8 — Final Verification

Visit your frontend URL and test:

- [ ] Products load on homepage
- [ ] Search works (type something, wait 400ms)
- [ ] Filters work (select category, click Apply)
- [ ] Pagination works
- [ ] Login as `user@example.com / user1234`
- [ ] "Admin Panel" link NOT visible for user
- [ ] Login as `admin@example.com / admin123`
- [ ] "Admin Panel" link IS visible
- [ ] Create a product in admin panel
- [ ] Edit a product
- [ ] Delete a product
- [ ] Logout → redirected to login

---

## Step 9 — Update README

Update the live demo link in your `README.md`:
```md
**Live Demo:** [https://mern-frontend-abc.vercel.app](https://mern-frontend-abc.vercel.app)
```

---

## Auto-Deploy on Push

From now on, every time you push to GitHub:
```bash
git add .
git commit -m "your message"
git push
```
Vercel automatically rebuilds and redeploys both frontend and backend. No manual steps needed.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend returns 500 | Check Vercel function logs → Project → Functions tab |
| CORS error in browser | Make sure `CLIENT_URL` env var matches your exact frontend URL |
| Products don't load | Check `VITE_API_URL` has `/api` at the end |
| Login fails | Check `JWT_SECRET` and `MONGO_URI` are set in backend env vars |
| Page refresh gives 404 | Make sure `frontend/vercel.json` exists with rewrites rule |
| MongoDB connection fails | Check Atlas Network Access has `0.0.0.0/0` allowed |

---

## Project URLs Summary

| Service | URL |
|---------|-----|
| Frontend | `https://mern-frontend-abc.vercel.app` |
| Backend | `https://mern-backend-xyz.vercel.app` |
| API Health | `https://mern-backend-xyz.vercel.app/api/health` |
| MongoDB | MongoDB Atlas (cloud.mongodb.com) |
