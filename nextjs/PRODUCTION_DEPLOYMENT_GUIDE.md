# Production Deployment Guide - Stripe Integration

## 🚨 CRITICAL: Missing Environment Variables

Your production server is **missing Stripe environment variables**!

### Current Status

**✅ What's Good:**
- No hardcoded localhost URLs in code
- `window.location.origin` used for dynamic URLs
- No hardcoded API keys in codebase
- Proper .gitignore for secrets
- Docker deployment workflow ready

**❌ What's Missing on Production:**
```bash
# These are NOT in /root/docker-images/bonucakes/.env.bonucakes:
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

## 🚀 Step-by-Step Production Setup

### Step 1: Get Live Stripe Keys

1. Go to https://dashboard.stripe.com
2. **IMPORTANT:** Toggle to **"Live mode"** (top right corner)
3. Navigate to **Developers → API keys**
4. Copy these keys:
   - **Publishable key**: `pk_live_...`
   - **Secret key**: `sk_live_...` (click "Reveal live key")

### Step 2: Set Up Production Webhook

1. In Stripe Dashboard: **Developers → Webhooks**
2. Click **"Add endpoint"**
3. **Endpoint URL**: `https://bonucakes.com/api/stripe/webhook`
4. **Events to select**:
   ```
   ✓ payment_intent.succeeded
   ✓ payment_intent.payment_failed
   ✓ charge.refunded
   ```
5. Click **"Add endpoint"**
6. **Copy the Signing secret** (starts with `whsec_...`)

### Step 3: Add Stripe Keys to Production Server

**SSH into your production server:**

```bash
ssh root@178.128.41.146
```

**Edit the environment file:**

```bash
nano /root/docker-images/bonucakes/.env.bonucakes
```

**Add these lines to the file:**

```bash
# --- Stripe Configuration (LIVE MODE)
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_PRODUCTION_WEBHOOK_SECRET_HERE
```

**Save and exit:** Press `Ctrl+X`, then `Y`, then `Enter`

**Secure the file:**

```bash
chmod 600 /root/docker-images/bonucakes/.env.bonucakes
chown root:root /root/docker-images/bonucakes/.env.bonucakes
```

### Step 4: Deploy to Production

**Option A: Push to GitHub (Automatic Deployment)**

```bash
# On your local machine
cd /Users/dakthi/Documents/Factory-Tech/clients/04-non-commercial/bonucakes

# Commit and push
git add -A
git commit -m "Add Stripe integration and security features"
git push origin main

# GitHub Actions will automatically:
# 1. Build Docker image
# 2. Copy to VPS
# 3. Run deploy script
# 4. Restart containers with new env vars
```

**Option B: Manual Deployment (Testing)**

```bash
# SSH into server
ssh root@178.128.41.146

# Navigate to project directory
cd /root/docker-images/bonucakes

# Restart containers to pick up new env vars
docker compose -f docker-compose.yml --env-file .env.bonucakes down
docker compose -f docker-compose.yml --env-file .env.bonucakes up -d

# Check logs
docker logs nextjs_bonucakes -f
```

### Step 5: Verify Deployment

**Check the site is running:**

```bash
# From anywhere
curl -I https://bonucakes.com

# Should return 200 OK
```

**Check Stripe configuration loaded:**

```bash
ssh root@178.128.41.146
docker logs nextjs_bonucakes | grep -i stripe

# Should see Stripe client initialized
```

**Test webhook endpoint:**

```bash
# In Stripe Dashboard → Webhooks → Your endpoint
# Click "Send test webhook"
# Select "payment_intent.succeeded"
# Verify it returns 200 OK
```

### Step 6: Production Testing Checklist

**⚠️ IMPORTANT: Test with real money in small amounts first!**

#### Test 1: Successful Payment
- [ ] Go to https://bonucakes.com
- [ ] Add item to cart
- [ ] Checkout with **real credit card**
- [ ] Use smallest amount possible (e.g., 1 item = ~£14)
- [ ] Verify payment succeeds
- [ ] Check order appears in admin
- [ ] Verify order status is "confirmed" and payment_status is "paid"
- [ ] Verify payment_method is set to "stripe"
- [ ] Check Stripe Dashboard shows the payment

#### Test 2: Webhook Delivery
- [ ] In Stripe Dashboard → Webhooks → Your endpoint
- [ ] Check "Recent deliveries"
- [ ] Verify all events show 200 status
- [ ] If any show errors, check logs:
  ```bash
  docker logs nextjs_bonucakes | grep -A 10 "webhook"
  ```

#### Test 3: Refund
- [ ] Go to https://bonucakes.com/admin/orders
- [ ] Find the test order
- [ ] Click "Refund"
- [ ] Verify refund processes in Stripe
- [ ] Check order status updates to "refunded"
- [ ] Verify refund appears in Stripe Dashboard

#### Test 4: Failed Payment
- [ ] Create another order
- [ ] Use a card that will be declined: `4000 0000 0000 0002`
- [ ] Verify payment fails gracefully
- [ ] Check order stays "pending"
- [ ] Verify error message shown to user

## 🔍 Monitoring & Logs

### View Application Logs

```bash
# Real-time logs
ssh root@178.128.41.146
docker logs nextjs_bonucakes -f

# Filter for payment-related logs
docker logs nextjs_bonucakes 2>&1 | grep -i "payment\|stripe\|refund"
```

### Monitor Stripe Activity

**Stripe Dashboard:**
- **Payments** → View all transactions
- **Webhooks** → Monitor delivery status
- **Events** → See all Stripe events

**Key things to watch:**
- Successful payment rate
- Failed payment reasons
- Webhook delivery success rate
- Refund requests

### Database Checks

```bash
# SSH into server
ssh root@178.128.41.146

# Connect to database
docker exec -it bonucakes_postgres psql -U bonucakes_user -d bonucakes_db

# Check recent orders
SELECT order_number, customer_name, total, status, payment_status, payment_method, created_at
FROM orders
ORDER BY created_at DESC
LIMIT 10;

# Exit
\q
```

## 🚨 Troubleshooting

### Issue: "Payment succeeded but order still pending"

**Cause:** Webhook not firing or failing

**Fix:**
1. Check webhook secret is correct in `.env.bonucakes`
2. Verify webhook URL is `https://bonucakes.com/api/stripe/webhook`
3. Check webhook deliveries in Stripe Dashboard
4. Check server logs: `docker logs nextjs_bonucakes | grep webhook`

### Issue: "Duplicate payments created"

**Status:** ✅ **FIXED** with in-memory locking

**Verification:**
- Check logs don't show duplicate `[Payment Intent] Creating new payment intent`
- Should see `[Payment Intent] Request already in progress, waiting...`

### Issue: "Refund fails"

**Possible causes:**
1. Order doesn't have `stripePaymentIntentId`
2. Payment not actually in Stripe
3. Insufficient permissions

**Fix:**
```bash
# Check order has payment intent ID
docker exec -it bonucakes_postgres psql -U bonucakes_user -d bonucakes_db -c \
  "SELECT order_number, stripe_payment_intent_id FROM orders WHERE id='ORDER_ID';"

# If missing, can't refund via Stripe
```

### Issue: "Rate limit 429 errors"

**Status:** ✅ **FIXED** - Admin routes exempt from rate limiting

**Verification:**
- Admin pages should load without 429 errors
- Public API still rate limited

## 📋 Environment Variables Reference

### Production Server Location
```
/root/docker-images/bonucakes/.env.bonucakes
```

### Required Stripe Variables
```bash
# Replace with your actual live keys:
STRIPE_SECRET_KEY=sk_live_51Re00U4NeC5j1uHR...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51Re00U4NeC5j1uHR...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Docker Container Names
- App: `nextjs_bonucakes`
- Database: `bonucakes_postgres`

### Exposed Ports
- Production: `127.0.0.1:3006:3000` (only localhost)
- Database: Internal network only

## 🔒 Security Checklist

Before going live:

- [ ] Using **live** Stripe keys (not test keys)
- [ ] `.env.bonucakes` has `chmod 600` permissions
- [ ] Webhook URL is HTTPS: `https://bonucakes.com/api/stripe/webhook`
- [ ] Webhook secret matches Stripe Dashboard
- [ ] Rate limiting is active
- [ ] Security headers configured
- [ ] CSRF protection enabled
- [ ] Input sanitization active
- [ ] No test keys committed to git
- [ ] GitHub Actions secrets configured correctly

## 📞 Emergency Procedures

### Disable Stripe Payments Immediately

```bash
# SSH to server
ssh root@178.128.41.146

# Remove Stripe keys
nano /root/docker-images/bonucakes/.env.bonucakes
# Comment out STRIPE_SECRET_KEY

# Restart
docker compose -f /root/docker-images/bonucakes/docker-compose.yml \
  --env-file /root/docker-images/bonucakes/.env.bonucakes restart app
```

### Rollback to Previous Version

```bash
# GitHub Actions keeps previous image
# SSH to server and use old image tag
ssh root@178.128.41.146
cd /root/docker-images/bonucakes

# List available images
docker images | grep bonucakes

# Update docker-compose.yml to use previous tag
# Then restart
```

## ✅ Final Pre-Launch Checklist

Before accepting real customer payments:

1. **Stripe Setup**
   - [ ] Live mode enabled in Stripe Dashboard
   - [ ] Live API keys added to production `.env.bonucakes`
   - [ ] Webhook endpoint configured: `https://bonucakes.com/api/stripe/webhook`
   - [ ] Webhook events selected (payment_intent.succeeded, payment_failed, charge.refunded)
   - [ ] Webhook signing secret added to `.env.bonucakes`

2. **Code Deployment**
   - [ ] Latest code pushed to GitHub main branch
   - [ ] GitHub Actions deployment completed successfully
   - [ ] Containers restarted with new environment variables
   - [ ] Application accessible at https://bonucakes.com

3. **Testing**
   - [ ] Test successful payment with real card (small amount)
   - [ ] Verify webhook delivery in Stripe Dashboard
   - [ ] Test refund functionality
   - [ ] Test failed payment handling
   - [ ] Verify no duplicate transactions
   - [ ] Check order status updates correctly

4. **Monitoring**
   - [ ] Access to Stripe Dashboard
   - [ ] Access to server logs (`docker logs`)
   - [ ] Access to database for verification
   - [ ] Phone/email alerts configured for critical errors

---

**Ready to deploy?**

Start with **Step 3** (adding Stripe keys), then **Step 4** (deploy), then **Step 6** (testing).

**Questions?** Check logs first:
```bash
docker logs nextjs_bonucakes -f
```
