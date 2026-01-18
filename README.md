# 🛍️ Văn Phòng Phẩm - Office Supplies E-commerce Platform

A premium, full-stack e-commerce platform for office supplies and stationery, built with modern web technologies and stunning UI/UX design.

![Platform](https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=1200)

## ✨ Features

### 🛒 Shopping Experience
- **Stunning Home Page** - Hero section with parallax effects, category grid, and product carousels
- **Product Discovery** - Advanced search, filtering by categories, bestsellers, and new arrivals
- **Product Details** - Image gallery with zoom, reviews, specifications, and related products
- **Smart Cart** - Real-time cart management with quantity controls and price calculations
- **Seamless Checkout** - Multi-step checkout with address management and payment options

### 👤 User Features
- **User Profile** - Comprehensive profile management with avatar, personal info, and preferences
- **Order History** - View all orders with status tracking and timeline visualization
- **Points & Rewards** - Loyalty program with points accumulation and voucher redemption
- **Address Book** - Manage multiple shipping addresses
- **Security Settings** - Two-factor authentication, login history, and device management

### 💼 Admin Features
- **Product Management** - CRUD operations for products with image upload
- **Order Management** - Process orders, update status, and handle refunds
- **User Management** - View users, manage roles, and handle account issues
- **Voucher Management** - Create and manage discount vouchers
- **Offer Management** - Review and respond to customer price offers

### 🎨 Design Excellence
- **Premium UI/UX** - Glassmorphism, gradients, and smooth animations
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Dark Mode Ready** - Built with next-themes support
- **Accessibility** - ARIA labels and keyboard navigation
- **Performance** - Optimized images and lazy loading

## 🛠️ Technology Stack

### Frontend
- **React 19** - Latest React with server components support
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **TailwindCSS 4** - Utility-first CSS with custom design system
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations and transitions
- **Wouter** - Lightweight routing
- **React Hook Form + Zod** - Form handling and validation
- **TanStack Query** - Server state management

### Backend
- **Express.js** - Web server framework
- **PostgreSQL** - Production database
- **Drizzle ORM** - Type-safe database queries
- **Passport.js** - Authentication middleware
- **Express Session** - Session management
- **WebSocket** - Real-time updates

### Development
- **JSON Server** - Mock API for development
- **ESBuild** - Fast bundling
- **TypeScript** - End-to-end type safety
- **Drizzle Kit** - Database migrations

## 📦 Project Structure

```
vanphongphamdemo/
├── client/                  # Frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/         # Base UI components (buttons, cards, etc.)
│   │   │   ├── image-gallery.tsx
│   │   │   ├── review-section.tsx
│   │   │   ├── order-timeline.tsx
│   │   │   └── layout.tsx
│   │   ├── pages/          # Page components
│   │   │   ├── home.tsx
│   │   │   ├── product.tsx
│   │   │   ├── cart.tsx
│   │   │   ├── checkout.tsx
│   │   │   ├── order-history.tsx
│   │   │   ├── user-profile.tsx
│   │   │   ├── security.tsx
│   │   │   ├── admin.tsx
│   │   │   └── login.tsx
│   │   ├── services/       # API service layer
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and store
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── public/             # Static assets
│   └── index.html          # HTML template
├── server/                 # Backend application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database schemas
│   └── vite.ts            # Vite integration
├── fake-api/              # Mock API for development
│   └── db.json            # Mock data
├── shared/                # Shared types and utilities
├── package.json           # Dependencies and scripts
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** or **yarn**
- **PostgreSQL** (for production)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd vanphongphamdemo
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```bash
# Create .env file in root directory
DATABASE_URL=postgresql://user:password@localhost:5432/vanphongpham
SESSION_SECRET=your-secret-key-here
NODE_ENV=development
```

4. **Initialize database** (production mode)
```bash
npm run db:push
```

### Development

**Option 1: Full Stack (Development)**
```bash
# Terminal 1: Start backend server
npm run dev

# Terminal 2: Start frontend dev server
npm run dev:client
```

**Option 2: Frontend with Mock API**
```bash
# Terminal 1: Start mock API
npm run fake-api

# Terminal 2: Start frontend
npm run dev:client
```

Access the application:
- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:3000
- **Mock API**: http://localhost:3001

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🧑‍💻 Development Guide

### Mock API Endpoints

The mock API (`npm run fake-api`) provides the following endpoints:

```
GET    /users              # List all users
GET    /users/:id          # Get user by ID
POST   /users              # Create user
PATCH  /users/:id          # Update user
DELETE /users/:id          # Delete user

GET    /products           # List all products
GET    /products/:id       # Get product by ID
POST   /products           # Create product
PATCH  /products/:id       # Update product
DELETE /products/:id       # Delete product

GET    /categories         # List all categories
GET    /orders             # List all orders
GET    /orders?userId=:id  # Get user orders
GET    /vouchers           # List all vouchers
GET    /offers             # List all offers
GET    /carts              # List all carts
GET    /carts?userId=:id   # Get user cart
```

### Adding New Features

1. **Create a new page**
```tsx
// client/src/pages/my-page.tsx
export default function MyPage() {
  return <div>My Page Content</div>;
}
```

2. **Add route in App.tsx**
```tsx
<Route path="/my-page" component={MyPage} />
```

3. **Create API service** (if needed)
```tsx
// client/src/services/my-service.ts
export async function getMyData() {
  const res = await fetch('/api/my-data');
  return res.json();
}
```

### Design System

The application uses a comprehensive design system built on TailwindCSS:

**Colors**
- Primary: Elegant blue tones
- Secondary: Warm accent colors
- Muted: Subtle backgrounds
- Destructive: Error states

**Spacing**
- Follow 4px grid system
- Use TailwindCSS spacing scale

**Typography**
- Headers: Serif fonts for elegance
- Body: Sans-serif for readability
- Consistent font sizes and weights

**Components**
- Use Radix UI primitives from `components/ui/`
- Extend with custom styling
- Maintain consistency

## 📝 API Documentation

### Authentication

```typescript
// Login
POST /api/login
Body: { email: string, password: string }
Response: { user: User }

// Logout
POST /api/logout
Response: { success: boolean }

// Current User
GET /api/user
Response: { user: User }
```

### Products

```typescript
// Get all products
GET /api/products
Response: Product[]

// Get product by ID
GET /api/products/:id
Response: Product

// Create product (admin)
POST /api/products
Body: ProductInput
Response: Product
```

### Orders

```typescript
// Get user orders
GET /api/orders
Response: Order[]

// Create order
POST /api/orders
Body: OrderInput
Response: Order
```

## 🧪 Testing

```bash
# Type checking
npm run check

# Build test
npm run build
```

## 📱 Default Test Accounts

**Admin Account**
- Email: `admin@example.com`
- Password: `123`

**User Account**
- Email: `user@example.com`
- Password: `123444`

## 🎨 Design Highlights

- **Glassmorphism Effects** - Modern frosted glass UI elements
- **Smooth Animations** - Framer Motion powered transitions
- **Micro-interactions** - Hover effects and button animations
- **Color Gradients** - Rich, vibrant color schemes
- **Responsive Grid** - Mobile-first responsive layouts
- **Loading States** - Skeleton screens and spinners
- **Error Handling** - Beautiful error pages

## 🔒 Security Features

- Session-based authentication
- Password hashing (production)
- CSRF protection (production)
- Two-factor authentication support
- Login history tracking
- Device session management

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ for the stationery community**
