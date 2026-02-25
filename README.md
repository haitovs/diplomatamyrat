# 🏠 Hearth & Home - Household Goods E-Commerce Platform

A modern, full-stack e-commerce platform for household goods, built with React, TypeScript, Express, and Prisma.

## ✨ Features

### 🛒 Shopping Experience
- **Product Catalog** - Browse 30+ curated household essentials across 6 categories
- **Smart Filters** - Filter by category, search, and sort products
- **Product Details** - Rich product pages with multiple images, highlights, and specs
- **Shopping Cart** - Slide-out cart drawer with real-time updates
- **Guest Checkout** - Complete purchases without account creation
- **Multi-step Checkout** - Guided checkout flow with shipping and payment

### 👤 User Features
- **User Registration** - Create account with email and password
- **Authentication** - JWT-based secure login/logout
- **Order History** - View past orders and their status
- **Favorites** - Save products to wishlist (coming soon)

### 🎨 Design
- **Modern UI** - Clean, minimalist design with warm color palette
- **Responsive** - Works beautifully on desktop, tablet, and mobile
- **Animations** - Smooth transitions powered by Framer Motion
- **Accessibility** - Semantic HTML and keyboard navigation

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| TailwindCSS 4 | Styling |
| React Router 6 | Routing |
| Zustand | State Management |
| TanStack Query | Server State |
| Framer Motion | Animations |
| React Hook Form | Forms |
| Zod | Validation |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 20+ | Runtime |
| Express 4 | API Server |
| Prisma | ORM |
| SQLite | Database |
| JWT | Authentication |
| bcryptjs | Password Hashing |

## 🚀 Quick Start

### One-Click Start (Windows)
Simply double-click `run.bat` to:
- Install all dependencies
- Set up the database
- Seed sample data
- Start both frontend and backend servers

### Manual Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up database**
   ```bash
   cd server
   npx prisma generate
   npx prisma db push
   npx tsx prisma/seed.ts
   cd ..
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## 📧 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | demo@example.com | demo123 |
| Admin | admin@household.tm | admin123 |

## 📁 Project Structure

```
atamyrat-ecommerce-good/
├── frontend/               # React Frontend (Main Application)
│   ├── src/
│   │   ├── api/           # API client functions
│   │   ├── components/    # UI Components
│   │   ├── pages/         # Route pages
│   │   ├── store/         # Zustand stores
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Main app component
│   └── public/            # Static assets & images
├── server/                 # Express Backend
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Express middleware
│   │   └── lib/           # Utilities
│   └── prisma/
│       ├── schema.prisma  # Database schema
│       └── seed.ts        # Seed data
├── assets/                 # Legacy images (migrated to frontend/public)
├── run.bat                # One-click launcher
├── index.html             # Redirects to React app
└── package.json           # Root workspace
```

> **Note:** Old static HTML site has been consolidated into the React app.

## 🗃️ API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/featured` - Featured products
- `GET /api/products/:slug` - Single product
- `GET /api/products/:slug/related` - Related products

### Categories
- `GET /api/categories` - All categories
- `GET /api/categories/:slug` - Category with products

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart/items` - Add item
- `PATCH /api/cart/items/:id` - Update quantity
- `DELETE /api/cart/items/:id` - Remove item

### Orders
- `GET /api/orders` - User's orders
- `GET /api/orders/:id` - Order details
- `POST /api/orders` - Create order

## 🎯 Product Categories

1. **Kitchen** - Cookware, serveware, and prep tools
2. **Bathroom** - Spa towels, bath accessories, aromatherapy
3. **Living** - Lighting, throws, pillows, diffusers
4. **Storage** - Baskets, consoles, organizers
5. **Laundry** - Detergents, hampers, irons
6. **Outdoor** - Entertaining sets, planters, fire pits

## 📝 Development Notes

### Adding Products
1. Update `server/prisma/seed.ts` with new product data
2. Run `npm run db:setup` from root to reseed
3. Restart the development server

### Database Reset
```bash
# Delete database and reseed
cd server
rm prisma/dev.db
npx prisma db push
npx tsx prisma/seed.ts
```

### Production Build
```bash
npm run build
```

## 🔮 Roadmap

- [ ] Admin dashboard for product management
- [ ] Real payment integration (Stripe)
- [ ] Email notifications
- [ ] Product reviews submission
- [ ] Advanced search with filters
- [ ] Order tracking
- [ ] Inventory management

## 📄 License

This project is for educational purposes.

---

Made with ❤️ for the Diploma Project
