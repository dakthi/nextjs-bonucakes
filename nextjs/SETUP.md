# Bonu F&B Setup Guide

This guide will help you set up the Bonu F&B Next.js application from scratch.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Cloudflare R2 account (optional, for cloud storage)
- Resend account (optional, for email functionality)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure the following variables:

#### Required Variables

```env
# Database - Replace with your PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/bonucakes_db"

# NextAuth - Generate a secret: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"
```

#### Optional Variables (for production features)

```env
# Cloudflare R2 (for cloud image storage)
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="bonucakes"
R2_PUBLIC_URL="https://your-r2-public-url"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="noreply@bonucakes.com"

# Admin Configuration
ADMIN_EMAIL="admin@bonucakes.com"
ADMIN_PASSWORD="changeme123"  # Change this!
ADMIN_NAME="Admin User"

# API Endpoint
API_ENDPOINT="https://api.chartedconsultants.com/api"
```

### 3. Database Setup

Initialize the database with Prisma:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# (Optional) Seed the database with sample data
npm run db:seed
```

### 4. Create Admin User

Create your first admin user:

```bash
npm run create-admin
```

This will create an admin account using the credentials from your `.env` file.

**Default credentials:**
- Email: admin@bonucakes.com
- Password: changeme123

⚠️ **Important:** Change the password immediately after first login!

### 5. Run Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Admin:** http://localhost:3000/admin/login

### 6. Verify Installation

1. Open http://localhost:3000 - You should see the Bonu F&B homepage
2. Open http://localhost:3000/admin/login - Login with your admin credentials
3. Navigate to http://localhost:3000/admin/products - You should see the products management page

## Database Migrations

### Creating New Migrations

When you modify the Prisma schema:

```bash
npx prisma migrate dev --name description_of_change
```

### Applying Migrations in Production

```bash
npx prisma migrate deploy
```

### Reset Database (Development Only)

⚠️ This will delete all data!

```bash
npx prisma migrate reset
```

## Database Seeding

The seed script (`prisma/seed.ts`) will populate your database with:
- Sample products (Vietnamese food items)
- Sample courses (F&B training courses)
- Sample blog posts
- Sample FAQs
- Sample discounts

To run the seed:

```bash
npm run db:seed
```

## Prisma Studio

To view and edit your database visually:

```bash
npx prisma studio
```

This opens a web interface at http://localhost:5555

## Troubleshooting

### Database Connection Issues

If you get connection errors:

1. Check your `DATABASE_URL` in `.env`
2. Ensure PostgreSQL is running
3. Verify database exists: `psql -U postgres -l`
4. Create database if needed: `createdb bonucakes_db`

### Prisma Client Issues

If you get "Prisma Client not generated" errors:

```bash
npx prisma generate
```

### Migration Issues

If migrations fail:

1. Check the error message carefully
2. Ensure database is accessible
3. Try resetting (development only): `npx prisma migrate reset`

### NextAuth Issues

If authentication doesn't work:

1. Verify `NEXTAUTH_SECRET` is set
2. Ensure `NEXTAUTH_URL` matches your domain
3. Check browser console for errors

## Production Deployment

### 1. Build the Application

```bash
npm run build:check
```

This will:
- Run TypeScript type checking
- Run ESLint
- Build the production bundle

### 2. Set Environment Variables

Set all required environment variables in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Other platforms: Follow their documentation

### 3. Run Migrations

```bash
npx prisma migrate deploy
```

### 4. Start Production Server

```bash
npm run start
```

## Key Features

### Multilingual Support (VI/EN)

All content models support both Vietnamese and English:
- Products: `nameVi`, `nameEn`, `descriptionVi`, `descriptionEn`
- Courses: `titleVi`, `titleEn`, `descriptionVi`, `descriptionEn`
- Blog Posts: `titleVi`, `titleEn`, `contentVi`, `contentEn`

### Admin Dashboard

Access at `/admin` with features:
- Product management (CRUD)
- Course management
- Blog post management
- Order tracking
- User management
- Media library

### Cart Functionality

- Zustand for state management
- LocalStorage persistence
- "Buy 10 get 1 free" promotion
- £8 flat shipping fee
- Real-time total calculation

### Image Storage

Two options:
1. **Cloudflare R2** (recommended for production) - Set R2 environment variables
2. **Local Storage** (development) - Images stored in `/public/uploads`

## Next Steps

1. ✅ Complete setup steps above
2. ✅ Login to admin dashboard
3. ✅ Create your first product
4. ✅ Test the cart functionality
5. ✅ Create blog posts
6. ✅ Customize homepage content
7. ✅ Set up R2 storage for production
8. ✅ Configure email with Resend
9. ✅ Deploy to production

## Support

For issues or questions:
- Check the README.md
- Review the Prisma schema: `prisma/schema.prisma`
- Check API routes documentation in the code
- Review component documentation

## Security Checklist

Before going to production:

- [ ] Change default admin password
- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Use environment variables (never commit `.env`)
- [ ] Enable HTTPS
- [ ] Set up proper CORS if using external APIs
- [ ] Review and restrict R2 bucket permissions
- [ ] Enable rate limiting on sensitive endpoints
- [ ] Set up monitoring and logging
- [ ] Regular database backups
- [ ] Keep dependencies updated

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run lint             # Run linter
npm run lint:fix         # Fix linting issues
npm run type-check       # TypeScript check

# Database
npx prisma studio        # Visual database editor
npx prisma generate      # Generate Prisma Client
npx prisma migrate dev   # Create migration
npx prisma migrate deploy # Apply migrations (production)
npm run db:seed          # Seed database

# Admin
npm run create-admin     # Create admin user

# Production
npm run build            # Build for production
npm run build:check      # Type check + lint + build
npm run start            # Start production server
```

Happy coding! 🚀
