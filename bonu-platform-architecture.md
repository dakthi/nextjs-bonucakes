# Bonu Platform - Full Stack Architecture

> **Vision:** Từ website thông tin → Trung tâm điều khiển kinh doanh F&B

---

## Feature Map

```mermaid
mindmap
  root((Bonu Platform))
    Public Website
      Homepage
      Products catalog
      Blog/Content
      Workshop landing
      Booking page
      Checkout
    Customer Portal
      Order history
      Booking management
      Profile
    Admin Dashboard
      Orders management
      CRM/Contacts
      Newsletter
      Products CRUD
      Blog CMS
      Bookings/Calendar
      Analytics
    Integrations
      Stripe payments
      Google Calendar
      Resend email
      WhatsApp notifications
```

---

## Core Features Breakdown

### 1. 🛒 E-Commerce & Orders

| Feature | Description | Priority |
|---------|-------------|----------|
| Product catalog | SSR pages, SEO optimized | P0 |
| Shopping cart | Persistent (DB-backed) | P0 |
| Checkout flow | Multi-step, address validation | P0 |
| Stripe payments | Card, Apple Pay, Google Pay | P0 |
| Order confirmation | Email + WhatsApp | P0 |
| Order tracking | Status updates, delivery tracking | P1 |
| Refunds | Admin-initiated via Stripe | P1 |
| Invoices | PDF generation | P2 |

### 2. 📧 Newsletter & Email Marketing

| Feature | Description | Priority |
|---------|-------------|----------|
| Subscriber collection | Forms on website | P0 |
| Subscriber management | Tags, segments | P1 |
| Campaign builder | Template editor | P1 |
| Send campaigns | Via Resend/Mailgun | P1 |
| Analytics | Open rates, clicks | P2 |
| Automation | Welcome series, abandoned cart | P2 |

### 3. 👥 CRM & Contacts

| Feature | Description | Priority |
|---------|-------------|----------|
| Contact database | All leads, customers, attendees | P0 |
| Contact sources | Order, workshop, newsletter, booking | P0 |
| Tags & segments | VIP, workshop-attendee, customer | P1 |
| Activity timeline | Orders, emails, bookings per contact | P1 |
| Notes | Admin notes on contacts | P1 |
| Export | CSV export | P2 |

### 4. 📅 Booking & Calendar

| Feature | Description | Priority |
|---------|-------------|----------|
| Service types | 1-1 consultation, workshop, etc. | P0 |
| Availability management | Set working hours | P0 |
| Booking page | Public booking form | P0 |
| Google Calendar sync | 2-way sync | P0 |
| Confirmation emails | Auto-send on booking | P0 |
| Reminders | 24h, 1h before | P1 |
| Rescheduling | Self-service | P1 |
| Payments for bookings | Deposit or full payment | P2 |

### 5. 🎓 Workshop Management

| Feature | Description | Priority |
|---------|-------------|----------|
| Workshop pages | Landing pages per workshop | P0 |
| Registration form | Collect attendee info | P0 |
| Attendee management | List, export, email | P0 |
| Zoom integration | Auto-generate links | P1 |
| Attendance tracking | Who showed up | P1 |
| Post-workshop follow-up | Automated emails | P1 |

### 6. 📝 Blog/CMS

| Feature | Description | Priority |
|---------|-------------|----------|
| Rich text editor | WYSIWYG or Markdown | P0 |
| Image uploads | To S3/Cloudflare R2 | P0 |
| Draft/Publish | Status management | P0 |
| Categories/Tags | Organization | P1 |
| SEO fields | Meta title, description | P1 |
| Scheduling | Publish at future date | P2 |

### 7. 📊 Admin Dashboard

| Feature | Description | Priority |
|---------|-------------|----------|
| Overview/Stats | Revenue, orders, contacts today | P0 |
| Orders list | Filter, search, status update | P0 |
| Contacts list | All CRM data | P0 |
| Products management | CRUD | P0 |
| Blog management | CRUD | P0 |
| Bookings calendar | View all bookings | P1 |
| Newsletter campaigns | Create, send | P1 |
| Settings | Business info, notifications | P1 |

---

## Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  Next.js 14 (App Router) + TypeScript + Tailwind            │
│  • shadcn/ui components                                      │
│  • React Query for data fetching                            │
│  • Zustand for client state                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND (API)                           │
│  Next.js API Routes (Route Handlers)                        │
│  • Authentication: NextAuth.js + Prisma Adapter             │
│  • Validation: Zod                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE                               │
│  PostgreSQL (self-hosted on VPS) + Prisma ORM               │
│  • Products, Orders, Contacts, Bookings, Posts, etc.        │
│  • Managed via pgAdmin or CLI                               │
│  • Daily backups via cron + pg_dump                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     INTEGRATIONS                             │
│  • Stripe - Payments, refunds, invoices                     │
│  • Resend - Transactional & marketing emails                │
│  • Google Calendar API - Booking sync                       │
│  • Cloudflare R2 - Image/file storage                       │
│  • WhatsApp Business API (optional) - Notifications         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT                              │
│  VPS (DigitalOcean) - All-in-one self-hosted                │
│  • Docker Compose: Next.js + PostgreSQL + Nginx             │
│  • SSL via Certbot/Let's Encrypt                            │
│  • GitHub Actions for CI/CD                                 │
└─────────────────────────────────────────────────────────────┘
```

### Why Straight Postgres (No Supabase)

| Aspect | Supabase | Self-hosted Postgres |
|--------|----------|---------------------|
| Cost | $25/mo Pro tier | $0 (on existing VPS) |
| Control | Limited | Full control |
| Vendor lock-in | Yes | No |
| Realtime | Built-in | Need to add if needed |
| Auth | Built-in | NextAuth (flexible) |
| Backups | Managed | DIY (pg_dump + cron) |

**Decision: Self-hosted Postgres** - Already have VPS, full control, no extra cost.

---

## Database Schema (Draft)

```mermaid
erDiagram
    Contact ||--o{ Order : places
    Contact ||--o{ Booking : makes
    Contact ||--o{ WorkshopRegistration : registers
    Contact ||--o{ NewsletterSubscription : subscribes

    Order ||--|{ OrderItem : contains
    OrderItem }|--|| Product : references
    Order ||--o| Payment : has
    Order ||--o| Refund : has

    Workshop ||--o{ WorkshopRegistration : has

    Booking }|--|| Service : for
    Booking ||--o| Payment : has

    Post ||--o{ PostCategory : tagged

    Contact {
        uuid id PK
        string email UK
        string name
        string phone
        string source "order|workshop|newsletter|booking"
        json tags
        json metadata
        timestamp created_at
    }

    Product {
        uuid id PK
        string slug UK
        json name "vi/en"
        json description "vi/en"
        int price_cents
        string currency
        json images
        boolean available
        int sort_order
        timestamp created_at
    }

    Order {
        uuid id PK
        string order_number UK "BM-YYYYMMDD-XXX"
        uuid contact_id FK
        string status "pending|confirmed|preparing|shipped|delivered|cancelled"
        json shipping_address
        int subtotal_cents
        int shipping_cents
        int total_cents
        string currency
        text notes
        timestamp created_at
    }

    OrderItem {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        int quantity
        int unit_price_cents
    }

    Payment {
        uuid id PK
        uuid order_id FK
        uuid booking_id FK
        string stripe_payment_id
        string status "pending|succeeded|failed|refunded"
        int amount_cents
        string currency
        timestamp created_at
    }

    Refund {
        uuid id PK
        uuid order_id FK
        uuid payment_id FK
        string stripe_refund_id
        int amount_cents
        string reason
        timestamp created_at
    }

    Service {
        uuid id PK
        string name
        text description
        int duration_minutes
        int price_cents
        string currency
        boolean active
    }

    Booking {
        uuid id PK
        uuid contact_id FK
        uuid service_id FK
        timestamp start_time
        timestamp end_time
        string status "pending|confirmed|cancelled|completed"
        string google_event_id
        text notes
        timestamp created_at
    }

    Workshop {
        uuid id PK
        string title
        text description
        timestamp event_date
        string zoom_link
        string status "draft|published|completed"
        int max_attendees
        timestamp created_at
    }

    WorkshopRegistration {
        uuid id PK
        uuid workshop_id FK
        uuid contact_id FK
        json answers "Q&A responses"
        boolean attended
        timestamp created_at
    }

    NewsletterSubscription {
        uuid id PK
        uuid contact_id FK
        string status "active|unsubscribed"
        json tags
        timestamp subscribed_at
        timestamp unsubscribed_at
    }

    Post {
        uuid id PK
        string slug UK
        string title
        text excerpt
        text content
        string image
        string status "draft|published"
        timestamp published_at
        timestamp created_at
    }
```

---

## Page Structure

```
app/
├── (public)/
│   ├── page.tsx                    # Homepage
│   ├── products/
│   │   ├── page.tsx                # Product listing
│   │   └── [slug]/page.tsx         # Product detail
│   ├── blog/
│   │   ├── page.tsx                # Blog listing
│   │   └── [slug]/page.tsx         # Blog post
│   ├── workshop/
│   │   ├── page.tsx                # Workshop listing
│   │   └── [slug]/page.tsx         # Workshop detail + registration
│   ├── booking/page.tsx            # Public booking page
│   ├── cart/page.tsx               # Shopping cart
│   ├── checkout/page.tsx           # Checkout flow
│   └── story/page.tsx              # About/Story
│
├── (customer)/
│   ├── account/
│   │   ├── page.tsx                # Dashboard
│   │   ├── orders/page.tsx         # Order history
│   │   └── bookings/page.tsx       # My bookings
│
├── (admin)/
│   ├── admin/
│   │   ├── page.tsx                # Dashboard overview
│   │   ├── orders/
│   │   │   ├── page.tsx            # Orders list
│   │   │   └── [id]/page.tsx       # Order detail
│   │   ├── contacts/
│   │   │   ├── page.tsx            # CRM contacts list
│   │   │   └── [id]/page.tsx       # Contact detail
│   │   ├── products/
│   │   │   ├── page.tsx            # Products list
│   │   │   ├── new/page.tsx        # New product
│   │   │   └── [id]/page.tsx       # Edit product
│   │   ├── posts/
│   │   │   ├── page.tsx            # Posts list
│   │   │   ├── new/page.tsx        # New post
│   │   │   └── [id]/page.tsx       # Edit post
│   │   ├── workshops/
│   │   │   ├── page.tsx            # Workshops list
│   │   │   └── [id]/
│   │   │       ├── page.tsx        # Workshop detail
│   │   │       └── attendees/page.tsx
│   │   ├── bookings/page.tsx       # Bookings calendar
│   │   ├── newsletter/
│   │   │   ├── page.tsx            # Campaigns list
│   │   │   └── new/page.tsx        # New campaign
│   │   └── settings/page.tsx       # Settings
│
├── api/
│   ├── auth/[...nextauth]/route.ts
│   ├── orders/route.ts
│   ├── payments/
│   │   ├── route.ts
│   │   └── webhook/route.ts        # Stripe webhook
│   ├── bookings/route.ts
│   ├── newsletter/route.ts
│   └── ...
│
└── layout.tsx
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Next.js project setup với TypeScript, Tailwind, shadcn/ui
- [ ] Supabase setup + Prisma schema
- [ ] Auth (NextAuth với magic link)
- [ ] Basic admin layout

### Phase 2: E-Commerce Core (Week 3-4)
- [ ] Migrate products from JSON to DB
- [ ] Product pages (SSG)
- [ ] Cart (DB-backed)
- [ ] Checkout + Stripe integration
- [ ] Order management admin

### Phase 3: CRM & Contacts (Week 5)
- [ ] Contact model + admin UI
- [ ] Auto-create contacts from orders
- [ ] Tags & segments
- [ ] Activity timeline

### Phase 4: Workshop & Booking (Week 6-7)
- [ ] Workshop management
- [ ] Registration flow
- [ ] Booking system
- [ ] Google Calendar integration

### Phase 5: Newsletter & Marketing (Week 8)
- [ ] Subscriber management
- [ ] Campaign builder
- [ ] Email sending via Resend

### Phase 6: Polish & Launch (Week 9-10)
- [ ] Migrate existing data
- [ ] Testing
- [ ] Deploy to production
- [ ] Redirect old site

---

## Migration Strategy

### Data to Migrate

| Source | Destination | Records |
|--------|-------------|---------|
| `products.json` | `Product` table | ~15 products |
| `posts.json` | `Post` table | ~50 posts |
| Workshop form responses | `Contact` + `WorkshopRegistration` | 18 contacts |
| Existing orders (email) | `Order` table | Manual entry |

### URL Redirects

| Old URL | New URL |
|---------|---------|
| `/products.html` | `/products` |
| `/blog.html` | `/blog` |
| `/blog/post.html?slug=x` | `/blog/[slug]` |
| `/cart.html` | `/cart` |
| `/checkout.html` | `/checkout` |
| `/admin.html` | `/admin` |

---

## Cost Estimate (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| VPS (DigitalOcean) | $12-24/mo | Already have, may need upgrade |
| PostgreSQL | $0 | Self-hosted on VPS |
| Resend | $0-20/mo | 3k free, $20 for 50k emails |
| Stripe | 2.9% + 30¢ | Per transaction |
| Cloudflare R2 | $0-5/mo | 10GB free |
| Domain | Already owned | bonucakes.com |
| **Total** | **~$12-50/mo** | Much cheaper than managed services |

---

## Decisions Made

| Question | Decision |
|----------|----------|
| Database | ✅ Self-hosted PostgreSQL on VPS |
| Hosting | ✅ Self-hosted on VPS (Docker Compose) |
| Auth | TBD - Magic link recommended |
| Multi-language | TBD - `/en` `/vi` routes với next-intl? |
| Payments | TBD - Stripe + Bank transfer option? |

## Open Questions

1. **Auth method?**
   - Magic link (email) - simple, no password ← recommended
   - Google OAuth - easy for users
   - Both?

2. **Multi-language approach?**
   - next-intl với `/en` `/vi` routes
   - Or single language (Vietnamese primary)?

3. **Stripe hay payment alternatives?**
   - Stripe (best UX, higher fees)
   - Bank transfer only (current approach)
   - Both options?

---

## Docker Compose Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    restart: always
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://bonu:${DB_PASSWORD}@db:5432/bonu
      - NEXTAUTH_URL=https://bonucakes.com
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - RESEND_API_KEY=${RESEND_API_KEY}
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    restart: always
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    environment:
      - POSTGRES_USER=bonu
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=bonu
    ports:
      - "5432:5432"  # Remove in production or bind to localhost only

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - app

volumes:
  postgres_data:
```

### Backup Script

```bash
#!/bin/bash
# /opt/bonu/backup.sh - Run daily via cron

BACKUP_DIR="/opt/bonu/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Dump database
docker exec bonu-db pg_dump -U bonu bonu > "$BACKUP_DIR/bonu_$DATE.sql"

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

# Optional: Upload to R2/S3
# rclone copy "$BACKUP_DIR/bonu_$DATE.sql" r2:bonu-backups/
```

### Nginx Config

```nginx
# nginx.conf
server {
    listen 80;
    server_name bonucakes.com www.bonucakes.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name bonucakes.com www.bonucakes.com;

    ssl_certificate /etc/letsencrypt/live/bonucakes.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bonucakes.com/privkey.pem;

    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets caching
    location /_next/static {
        proxy_pass http://app:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

---

## CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy Bonu Platform

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/bonu
            git pull origin main
            docker compose build
            docker compose up -d
            docker exec bonu-app npx prisma migrate deploy
```

---

## Environment Variables

```bash
# .env.production
DATABASE_URL=postgresql://bonu:password@localhost:5432/bonu

# Auth
NEXTAUTH_URL=https://bonucakes.com
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# Email
RESEND_API_KEY=re_xxx
EMAIL_FROM=Bonu F&B <noreply@bonucakes.com>

# Google Calendar
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# Storage
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=bonu-assets
```

---

## File Structure (Final)

```
bonu-platform/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── (public)/          # Public pages
│   │   ├── (customer)/        # Customer portal
│   │   ├── (admin)/           # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                # shadcn components
│   │   ├── forms/
│   │   ├── layouts/
│   │   └── ...
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── stripe.ts
│   │   ├── resend.ts
│   │   └── utils.ts
│   ├── hooks/
│   └── types/
├── public/
│   └── images/
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── .env.production
```

---

*Architecture draft created: 22/02/2026*
*Updated: 22/02/2026 - Switched to self-hosted Postgres*
