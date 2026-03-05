# Stripe Production Deployment Checklist

## ✅ Current Status (Development)
- ✅ Using test keys: `sk_test_...` and `pk_test_...`
- ✅ Test webhook secret configured
- ✅ Stripe CLI listening for local testing
- ✅ .env files properly gitignored
- ✅ No hardcoded API keys in code

## 🚀 Production Deployment Steps

### 1. Get Production Stripe Keys

**In Stripe Dashboard** (https://dashboard.stripe.com):
1. Switch from "Test mode" to "Live mode" (toggle in top right)
2. Go to **Developers > API keys**
3. Copy your **live** keys:
   - Publishable key (starts with `pk_live_...`)
   - Secret key (starts with `sk_live_...`) - Click "Reveal live key"

### 2. Set Up Production Webhook

**In Stripe Dashboard > Developers > Webhooks**:
1. Click **"Add endpoint"**
2. Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
3. Select events to listen to:
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `charge.refunded`
4. Click **"Add endpoint"**
5. Copy the **Signing secret** (starts with `whsec_...`)

### 3. Configure Production Server Environment Variables

**On your production server** (e.g., Vercel, DigitalOcean, etc.):

Set these environment variables:
```bash
# Stripe Keys (LIVE MODE)
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_PRODUCTION_WEBHOOK_SECRET

# Database (Production)
DATABASE_URL=postgresql://user:password@host:port/database

# Other existing env vars...
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_production_secret
# ... etc
```

### 4. Security Checklist

**BEFORE going live, verify:**

- [ ] ✅ `.env.local` is in `.gitignore` (ALREADY DONE)
- [ ] ✅ No API keys committed to git (ALREADY DONE)
- [ ] Test keys NEVER used in production
- [ ] Production webhook URL is HTTPS only
- [ ] Rate limiting is active (ALREADY DONE)
- [ ] CSRF protection enabled (ALREADY DONE)
- [ ] Security headers configured (ALREADY DONE)

### 5. Test in Production

**After deployment, test with real cards:**

1. **Successful payment test**:
   - Use a real card (will be charged!)
   - Verify webhook fires
   - Check order status updates to "paid"
   - Verify payment method is set to "stripe"

2. **Failed payment test**:
   - Use declined card: `4000 0000 0000 0002`
   - Verify order stays "pending"
   - Check error handling works

3. **Refund test**:
   - Mark paid order as refunded
   - Verify Stripe refund processes
   - Check webhook updates order status

### 6. Webhook Verification

**Test webhook is working:**
```bash
# In Stripe Dashboard > Webhooks > Your endpoint
# Check "Recent deliveries"
# Verify all events return 200 status
```

**Common webhook issues:**
- ❌ 401 Unauthorized → Check STRIPE_WEBHOOK_SECRET is correct
- ❌ 500 Internal Error → Check server logs for errors
- ❌ Timeout → Optimize webhook handler (currently well-optimized)

### 7. Monitor Production

**Set up monitoring for:**
1. **Stripe Dashboard > Payments**
   - Monitor successful/failed payments
   - Check refund requests

2. **Server Logs**
   - Watch for `[Payment Intent]` logs
   - Watch for `[Refund]` logs
   - Monitor webhook delivery

3. **Database**
   - Verify orders are created
   - Check payment statuses update correctly

## 📋 Environment Variables Quick Reference

### Development (.env.local)
```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...(from stripe CLI)
```

### Production (Server Environment Variables)
```bash
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...(from production webhook)
```

## 🔒 API Key Security - "How to Hide the API"

### What's Already Protected ✅

1. **`.env.local` is gitignored** - Keys never committed to GitHub
2. **Server-side keys** (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) are only used in API routes, never exposed to browser
3. **Public key** (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) is safe to expose - it's meant for client-side use

### Production Best Practices

**On your production server (e.g., root@178.128.41.146):**

```bash
# 1. Create .env file on server (NOT in git)
cd /root/bonucakes/nextjs
nano .env.local

# 2. Add production keys
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgresql://...

# 3. Protect the file
chmod 600 .env.local  # Only owner can read/write
chown root:root .env.local

# 4. NEVER commit this file
# (Already in .gitignore, so you're safe)
```

**Why this is secure:**
- ✅ `.env.local` only exists on your server, never in git
- ✅ Secret keys only accessible to server process
- ✅ Publishable key is meant to be public (limited permissions)
- ✅ Webhook secret validates requests are from Stripe

## ⚠️ CRITICAL: Before First Live Transaction

1. **Verify Test Mode is OFF** in Stripe Dashboard
2. **Double-check all environment variables** on production server
3. **Test with smallest amount possible** first (£0.01 test)
4. **Have refund process ready** in case of issues
5. **Monitor webhook deliveries** in real-time

## 🎯 Current Implementation Status

### ✅ Production-Ready Features
- Double transaction issue fixed (in-memory locking)
- Payment method only set when payment succeeds
- Automatic Stripe refunds working
- Webhook handler for all events
- Comprehensive error handling
- Rate limiting (admin routes excluded)
- Security headers configured
- Input sanitization active

### ⚠️ Needs Configuration for Production
- Live Stripe API keys
- Production webhook endpoint
- Production webhook secret
- SSL/HTTPS enabled on production domain

## 📞 Support & Troubleshooting

**Stripe Support:**
- Dashboard: https://dashboard.stripe.com
- Docs: https://stripe.com/docs
- Test cards: https://stripe.com/docs/testing

**Common Issues:**
1. **Payment fails silently** → Check webhook is configured
2. **Orders stuck in pending** → Verify webhook secret is correct
3. **Duplicate charges** → Fixed with in-memory locking (already done)
4. **Refund fails** → Check order has `stripePaymentIntentId`

---

**Ready to deploy?** Follow steps 1-3 above, then test thoroughly before going live!
