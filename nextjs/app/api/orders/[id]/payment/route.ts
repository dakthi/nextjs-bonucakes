import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

// In-memory lock to prevent race conditions
const paymentIntentLocks = new Map<string, Promise<any>>();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Check if there's already a pending request for this order
  const existingLock = paymentIntentLocks.get(id);
  if (existingLock) {
    console.log(`[Payment Intent] Request for order ${id} already in progress, waiting...`);
    try {
      const result = await existingLock;
      return NextResponse.json(result);
    } catch (error) {
      console.error('Locked request failed:', error);
      return NextResponse.json(
        { error: 'Failed to create payment intent' },
        { status: 500 }
      );
    }
  }

  // Create a promise for this request and store it
  const lockPromise = (async () => {
    try {
      // Fetch the Order to get total amount
      const order = await prisma.order.findUnique({
        where: { id },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // Check if order already has a payment intent
      if (order.stripePaymentIntentId) {
        console.log(`[Payment Intent] Order ${id} already has payment intent ${order.stripePaymentIntentId}, returning existing`);
        // Retrieve existing payment intent to return its client secret
        const existingIntent = await stripe.paymentIntents.retrieve(
          order.stripePaymentIntentId
        );
        return {
          clientSecret: existingIntent.client_secret,
          total: Number(order.total),
        };
      }

      console.log(`[Payment Intent] Creating new payment intent for order ${id}, amount: £${Number(order.total)}`);

      // Convert total amount to pence (smallest currency unit)
      const amountInPence = Math.round(Number(order.total) * 100);

      // Create a Stripe PaymentIntent for the full order amount
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInPence,
        currency: order.currency.toLowerCase(),
        metadata: {
          orderId: id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Update the Order with stripePaymentIntentId
      // Note: paymentMethod should only be set when payment succeeds (via webhook)
      await prisma.order.update({
        where: { id },
        data: {
          stripePaymentIntentId: paymentIntent.id,
          updatedAt: new Date(),
        },
      });

      console.log(`[Payment Intent] Successfully created payment intent ${paymentIntent.id} for order ${id}`);

      return {
        clientSecret: paymentIntent.client_secret,
        total: Number(order.total),
      };
    } finally {
      // Always clean up the lock
      paymentIntentLocks.delete(id);
    }
  })();

  // Store the promise
  paymentIntentLocks.set(id, lockPromise);

  try {
    const result = await lockPromise;
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to create payment intent:', error);
    if (error instanceof Error && error.message === 'Order not found') {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
