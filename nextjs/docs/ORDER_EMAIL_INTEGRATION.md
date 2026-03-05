# Order Email Confirmation System

## Overview

The order email confirmation system has been integrated directly into the Next.js application. When customers place orders through the website, the system:

1. Saves the order to the database
2. Sends an admin notification email
3. Sends a customer confirmation email with bank details and instructions
4. Updates customer records

## Architecture

### Components

1. **Email Templates** (`/lib/email-templates/order-emails.ts`)
   - `generateAdminEmail()` - Creates admin notification email
   - `generateCustomerEmail()` - Creates customer confirmation email
   - Both templates match the design from the original contact-api-server

2. **API Route** (`/app/api/orders/route.ts`)
   - Handles POST requests to create orders
   - Validates customer and order data
   - Generates unique order IDs and codes
   - Saves orders to database with Prisma
   - Sends emails via Resend
   - Updates customer records

3. **Checkout Page** (`/app/checkout/page.tsx`)
   - Updated to call local `/api/orders` instead of external API
   - Handles order submission and redirects to success page

## Order ID Generation

- **Order ID Format**: `BM-YYYYMMDD-XXX` (e.g., `BM-20260303-742`)
  - `BM` = Bánh Mì prefix
  - `YYYYMMDD` = Date in YYYYMMDD format
  - `XXX` = 3-digit random number

- **Order Code**: 4-digit hash code for easy reference (e.g., `4523`)
  - Generated using DJB2 hash algorithm
  - Used in email subject and customer communication

## Email Templates

### Admin Notification Email
- **To**: ADMIN_EMAIL (configured in .env)
- **Subject**: `[Đơn hàng mới #CODE] Product Name(s)`
- **Contents**:
  - Order code and date
  - Customer information (name, email, phone, address)
  - Order details with pricing
  - Special notes
  - Total payment calculation

### Customer Confirmation Email
- **To**: Customer's email
- **Subject**: `Xác nhận đơn hàng #CODE - Bonu Cakes`
- **Contents**:
  - Order confirmation with code
  - Order details with pricing
  - Bank transfer details (HSBC account)
  - Storage and preparation instructions
  - Contact information

## Bank Details (Hardcoded in API)

```typescript
const BANK_DETAILS = {
  bankName: 'HSBC',
  accountName: 'N M U NGUYEN',
  sortCode: '40-20-16',
  accountNumber: '22101505',
};
```

## Special Features

### Buy 10 Get 1 Free Promotion
- Automatically calculated for each order item
- Free items are added to the actual quantity
- Displayed in both admin and customer emails

### Database Integration
- Orders are saved to the `orders` table
- Order items saved to `order_items` table with promotion details
- Order history created with initial "pending" status
- Customer records updated or created automatically

## Environment Variables

Required in `.env`:

```bash
# Resend API for sending emails
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="Bonu F&B <noreply@chartedconsultants.com>"

# Admin notification email
ADMIN_EMAIL="bonucakes@gmail.com"

# Database connection
DATABASE_URL="postgresql://..."
```

## API Endpoint

### POST `/api/orders`

**Request Body**:
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "07123456789",
  "deliveryAddress": "123 Street, London, UK",
  "deliveryDate": "2024-03-15 (optional)",
  "specialNotes": "Please ring doorbell (optional)",
  "items": [
    {
      "productId": 1,
      "productName": "Bánh Mì",
      "quantity": 10,
      "unitPrice": 5.00,
      "unitVi": "ổ",
      "unit": "piece"
    }
  ],
  "pricing": {
    "currency": "GBP",
    "subtotal": 50.00,
    "shippingFee": 10.00,
    "total": 60.00,
    "shippingLabel": "UK Mainland"
  }
}
```

**Response**:
```json
{
  "success": true,
  "orderId": "BM-20260303-742",
  "orderCode": "4523",
  "message": "Đơn hàng đã được ghi nhận. Chúng tôi sẽ liên hệ với bạn sớm nhất."
}
```

## Error Handling

- Email failures don't prevent order creation
- Orders are saved to database even if emails fail
- Customer record updates are non-blocking
- All errors are logged to console for debugging

## Testing

To test the order flow:

1. Ensure environment variables are configured
2. Add products to cart
3. Go to checkout page
4. Fill in customer information
5. Submit order
6. Check:
   - Order saved in database
   - Admin email received
   - Customer email received
   - Redirect to success page

## Migration from External API

**Before**:
- Checkout called `https://api.chartedconsultants.com/api/orders/banh-mi`
- Orders not saved to database

**After**:
- Checkout calls local `/api/orders`
- Orders saved to database
- Same email templates and functionality
- Bank details configured in code instead of external config

## Future Improvements

1. Move bank details to environment variables or database
2. Add support for multiple payment methods
3. Implement email template management in admin panel
4. Add email delivery status tracking
5. Implement order confirmation webhooks
6. Add SMS notifications for order status updates
