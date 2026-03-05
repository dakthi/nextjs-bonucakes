# Testing Order Email System

## Prerequisites

Before testing, ensure you have:

1. **Environment Variables Configured**
   ```bash
   RESEND_API_KEY="re_Vdhpjcyg_JnRZKNS5eYJkHcT9thkAQZEV"
   RESEND_FROM_EMAIL="Bonu F&B <noreply@chartedconsultants.com>"
   ADMIN_EMAIL="bonucakes@gmail.com"
   DATABASE_URL="postgresql://..." # Your database connection
   ```

2. **Database Running**
   - PostgreSQL database is running
   - Database schema is up to date: `npx prisma db push`
   - Database can be accessed with the DATABASE_URL

3. **Development Server Running**
   ```bash
   npm run dev
   ```

## Test Scenarios

### Test 1: Single Item Order

**Goal**: Verify basic order flow with one item

1. Navigate to products page: `http://localhost:3000/products`
2. Add one product (e.g., Bánh Mì) with quantity 5
3. Go to cart
4. Click "Proceed to Checkout"
5. Fill in customer details:
   - Name: Test Customer
   - Email: your-test-email@example.com
   - Phone: 07123456789
   - Address: 123 Test Street, London, UK
6. Click "Place Order"

**Expected Results**:
- Order saved to database with status "pending"
- Redirect to success page with order code
- Admin email sent to bonucakes@gmail.com
- Customer confirmation email sent to your test email
- Both emails contain correct order details

### Test 2: Multiple Items Order

**Goal**: Verify order with multiple products

1. Add multiple products to cart
2. Adjust quantities
3. Complete checkout

**Expected Results**:
- All items listed in emails
- Correct subtotal calculation
- Shipping fee added (£8)
- Total calculated correctly

### Test 3: Buy 10 Get 1 Free Promotion

**Goal**: Verify promotion calculation

1. Add a product with quantity 10 or more (e.g., 15)
2. Complete checkout

**Expected Results**:
- Email shows "Mua 10 tặng 1 (thực tế X ổ)"
- Free items calculated correctly:
  - 10 items = 1 free (actually 11)
  - 15 items = 1 free (actually 16)
  - 20 items = 2 free (actually 22)
  - 25 items = 2 free (actually 27)

### Test 4: Special Notes

**Goal**: Verify special notes are included

1. Add items to cart
2. In checkout form, add special notes: "Please ring doorbell twice"
3. Complete checkout

**Expected Results**:
- Special notes appear in admin email
- Customer email does not show special notes (as per design)

### Test 5: Delivery Date (Optional)

**Goal**: Verify optional delivery date

1. Add items to cart
2. Fill in delivery date (if field exists in checkout form)
3. Complete checkout

**Expected Results**:
- Delivery date appears in both emails if provided

### Test 6: Error Handling - Invalid Email

**Goal**: Verify validation works

1. Add items to cart
2. Fill in customer details with invalid email: "notanemail"
3. Try to submit

**Expected Results**:
- Form validation prevents submission OR
- API returns 400 error: "Invalid email format"
- No order created in database
- No emails sent

### Test 7: Error Handling - Empty Cart

**Goal**: Verify empty cart handling

1. Go directly to checkout URL: `http://localhost:3000/checkout`
2. Without adding items to cart

**Expected Results**:
- Show "Cart is empty" message
- Link to return to products page
- No order creation possible

## Email Content Verification

### Admin Email Checklist

- [ ] Subject: `[Đơn hàng mới #CODE] Product Name(s)`
- [ ] Order code displayed prominently
- [ ] Submission date in Vietnamese format
- [ ] Customer information:
  - [ ] Name
  - [ ] Email (clickable mailto link)
  - [ ] Phone
  - [ ] Delivery address
- [ ] Order items with:
  - [ ] Quantity
  - [ ] Product name
  - [ ] Unit price
  - [ ] Line total
  - [ ] Free items (if applicable)
- [ ] Payment summary:
  - [ ] Subtotal
  - [ ] Shipping fee
  - [ ] Grand total
- [ ] Special notes (if provided)
- [ ] Action reminder to confirm after payment

### Customer Email Checklist

- [ ] Subject: `Xác nhận đơn hàng #CODE - Bonu Cakes`
- [ ] Greeting with customer name
- [ ] Order code displayed in highlight box
- [ ] Order items with:
  - [ ] Quantity
  - [ ] Product name
  - [ ] Pricing details
  - [ ] Free items (if applicable)
- [ ] Payment summary:
  - [ ] Subtotal
  - [ ] Shipping fee
  - [ ] Grand total
- [ ] Bank transfer details:
  - [ ] Bank name: HSBC
  - [ ] Account name: N M U NGUYEN
  - [ ] Sort code: 40-20-16
  - [ ] Account number: 22101505
  - [ ] Transfer reference: #CODE
- [ ] Storage warnings:
  - [ ] Refrigerate immediately
  - [ ] Meat will spoil without refrigeration
  - [ ] Don't heat pickled vegetables
- [ ] Preparation instructions:
  - [ ] Baking instructions
  - [ ] Warming filling
  - [ ] Assembly steps
  - [ ] Best served hot
- [ ] Contact information
- [ ] Signature: Uyên Nguyen, Bonu F&B

## Database Verification

After placing an order, check the database:

```sql
-- Check order was created
SELECT * FROM orders WHERE order_number = 'CODE';

-- Check order items
SELECT * FROM order_items WHERE order_id = 'ORDER_ID';

-- Check order history
SELECT * FROM order_history WHERE order_id = 'ORDER_ID';

-- Check customer record
SELECT * FROM customers WHERE email = 'customer@example.com';
```

**Expected Database State**:
- Order record with status "pending"
- Payment status "pending"
- All items saved with correct quantities and prices
- Order history entry with status "pending"
- Customer record created or updated with:
  - total_orders incremented
  - total_spent increased
  - last_order_date set to now

## Troubleshooting

### Emails Not Sending

1. **Check Resend API Key**:
   ```bash
   echo $RESEND_API_KEY
   ```
   Should be: `re_Vdhpjcyg_JnRZKNS5eYJkHcT9thkAQZEV`

2. **Check Resend Dashboard**:
   - Go to https://resend.com/
   - Check Logs section
   - Look for recent email attempts

3. **Check Console Logs**:
   - Look for error messages in terminal
   - Check browser console for API errors

### Order Not Saving to Database

1. **Check Database Connection**:
   ```bash
   npx prisma studio
   ```
   Should open Prisma Studio UI

2. **Check Database Schema**:
   ```bash
   npx prisma db push
   ```
   Updates schema if needed

3. **Check Console for Prisma Errors**:
   - Look for SQL errors
   - Check field type mismatches

### API Errors

1. **Check API Route Logs**:
   - Terminal running `npm run dev`
   - Look for error stack traces

2. **Test API Directly**:
   ```bash
   curl -X POST http://localhost:3000/api/orders \
     -H "Content-Type: application/json" \
     -d '{
       "customerName": "Test",
       "customerEmail": "test@example.com",
       "customerPhone": "07123456789",
       "deliveryAddress": "123 Street, London",
       "items": [{
         "productId": 1,
         "productName": "Test Product",
         "quantity": 1,
         "unitPrice": 10
       }],
       "pricing": {
         "currency": "GBP",
         "subtotal": 10,
         "shippingFee": 8,
         "total": 18,
         "shippingLabel": "UK Mainland"
       }
     }'
   ```

## Success Criteria

All tests pass when:

1. ✅ Orders are saved to database correctly
2. ✅ Admin emails arrive at bonucakes@gmail.com
3. ✅ Customer emails arrive at test email address
4. ✅ Emails contain all required information
5. ✅ Bank details are correct in customer email
6. ✅ Order codes are generated and displayed
7. ✅ Free items calculated for quantities ≥10
8. ✅ Success page shows correct order information
9. ✅ Customer records are created/updated
10. ✅ Error handling works for invalid input

## Production Testing

Before deploying to production:

1. Test with real domain email (after domain verification)
2. Test with production database
3. Verify email deliverability (not spam)
4. Test on mobile devices
5. Test with various email clients (Gmail, Outlook, etc.)
6. Load test with multiple concurrent orders
7. Verify Resend email limits are sufficient

## Monitoring in Production

After deployment, monitor:

1. **Order Creation Rate**: Check database for new orders
2. **Email Delivery Rate**: Check Resend dashboard
3. **Failed Orders**: Set up error logging/alerts
4. **Customer Complaints**: Orders placed but no email received

## Next Steps After Testing

Once all tests pass:

1. Document any issues found and resolved
2. Update environment variables for production
3. Verify domain ownership in Resend for production emails
4. Set up monitoring and alerting
5. Create admin documentation for order management
6. Train staff on new order notification system
