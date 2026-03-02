# Bonu F&B - Next.js Platform

A modern, full-stack F&B business platform built with Next.js, replicating and enhancing the original HTML website with a complete CMS and e-commerce system.

## Tech Stack

- **Framework**: Next.js 14.2.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Bonu brand colors
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: Zustand (for cart)
- **File Storage**: Cloudflare R2 (S3-compatible)
- **Email**: Resend
- **Image Processing**: Sharp
- **Forms**: React Hook Form

## Features

### Frontend
- 🏠 Homepage with hero video, featured products, blog highlights
- 🛍️ Product listing with filtering and search
- 🛒 Shopping cart with promotion logic ("Buy 10 get 1 free")
- 📝 Blog with multilingual support (VI/EN)
- 💳 Checkout process
- 🌍 Multilingual support (Vietnamese/English)
- 📱 Fully responsive design

### Admin Dashboard
- 👤 Admin authentication
- 📦 Product management (CRUD)
- 📚 Course management
- 📰 Blog post management
- 📋 Order management
- 👥 User management
- 🖼️ Media library with R2 storage

### API
- RESTful API endpoints
- Admin-protected routes
- Product reviews system
- Order processing

## Brand Colors

```js
cream: '#FDF8F3'
warmwhite: '#FFFBF5'
terracotta: '#C4704A'
espresso: '#3D2314'
gold: '#D4A853'
coffee: '#4A3728'
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Cloudflare R2 account (optional, for cloud storage)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- Database URL
- NextAuth secret
- R2 credentials (optional)
- Resend API key (for emails)

3. Set up the database:
```bash
npx prisma migrate dev
npx prisma db seed
```

4. Create an admin user:
```bash
npm run create-admin
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
nextjs/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard pages
│   ├── products/          # Product pages
│   ├── blog/              # Blog pages
│   ├── cart/              # Cart page
│   ├── checkout/          # Checkout page
│   └── ...                # Other pages
├── components/            # Reusable React components
├── lib/                   # Utility functions and configs
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # NextAuth configuration
│   ├── r2-storage.ts     # R2 storage utilities
│   └── stores/           # Zustand stores
├── types/                 # TypeScript type definitions
├── prisma/               # Database schema and migrations
│   └── schema.prisma     # Prisma schema
├── public/               # Static assets (images, videos, etc.)
└── ...
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run build:check` - Type check + lint + build
- `npm run db:seed` - Seed the database
- `npm run create-admin` - Create an admin user

## Environment Variables

See `.env.example` for all required environment variables.

## Database Models

- **Product** - Vietnamese food products with multilingual fields
- **Course** - F&B courses and workshops
- **BlogPost** - Blog articles with multilingual content
- **Order** - Customer orders
- **User** - Admin users
- **Review** - Product reviews
- **FAQ** - Frequently asked questions

## Multilingual Support

The platform supports Vietnamese (VI) and English (EN) with:
- Language toggle in navbar
- All product/course/blog content in both languages
- LocalStorage persistence for language preference

## Cart Features

- Add/remove items
- Quantity adjustment
- £8 flat shipping fee
- "Buy 10 get 1 free" promotion
- LocalStorage persistence
- Real-time total calculation

## Admin Features

- Secure authentication with NextAuth
- Full product CRUD with image upload
- Order management and tracking
- Blog post editor with markdown support
- Course/workshop management
- Media library with R2 cloud storage

## Deployment

The project is production-ready and can be deployed to:
- Vercel (recommended)
- Any Node.js hosting platform
- Docker containers

Make sure to set all environment variables in your deployment platform.

## License

Private - All rights reserved

## Support

For questions or support, contact the development team.
