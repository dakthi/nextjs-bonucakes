import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getStripe } from '@/lib/stripe';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      status,
      paymentStatus,
      paymentMethod,
      notes,
      changedBy,
      reason,
    } = body;

    // Get current order to compare changes
    const currentOrder = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (status !== undefined) updateData.status = status;
    if (paymentStatus !== undefined) {
      // If refunding and order was paid via Stripe, process actual Stripe refund
      if (paymentStatus === 'refunded' && currentOrder.stripePaymentIntentId && currentOrder.paymentMethod === 'stripe') {
        try {
          const stripe = getStripe();
          console.log(`[Refund] Processing Stripe refund for PaymentIntent: ${currentOrder.stripePaymentIntentId}`);

          const refund = await stripe.refunds.create({
            payment_intent: currentOrder.stripePaymentIntentId,
            reason: 'requested_by_customer',
          });

          console.log(`[Refund] Stripe refund successful: ${refund.id}, status: ${refund.status}`);

          // Update payment status to refunded
          updateData.paymentStatus = 'refunded';
        } catch (stripeError: any) {
          console.error('[Refund] Stripe refund failed:', stripeError);
          return NextResponse.json(
            {
              error: 'Failed to process Stripe refund',
              details: stripeError.message
            },
            { status: 400 }
          );
        }
      } else {
        // For non-Stripe payments (bank transfer), just update the status
        updateData.paymentStatus = paymentStatus;
      }

      // If marking as paid, set paidAt timestamp
      if (paymentStatus === 'paid' && currentOrder.paymentStatus !== 'paid') {
        updateData.paidAt = new Date();
      }
    }
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (notes !== undefined) updateData.adminNote = notes;

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Log the change in order history
    const changeNote = reason || `Payment status updated to ${paymentStatus} by ${changedBy || session.user.email}`;
    await prisma.orderHistory.create({
      data: {
        orderId: params.id,
        status: updatedOrder.status,
        note: changeNote,
      },
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      {
        error: 'Failed to update order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
