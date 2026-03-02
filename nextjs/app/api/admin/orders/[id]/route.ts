/**
 * Admin Individual Order API
 * GET: Get a single order by ID
 * PUT: Update order status, payment status, notes, etc.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for updating orders
const orderUpdateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  trackingNumber: z.string().optional(),
  estimatedDelivery: z.string().optional(),
  adminNote: z.string().optional(),
});

// Check if user is authenticated and is admin
async function checkAdminAuth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { authorized: false, error: 'Not authenticated' };
  }

  if (session.user.role !== 'admin') {
    return { authorized: false, error: 'Not authorized' };
  }

  return { authorized: true, session };
}

// GET: Get a single order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authCheck = await checkAdminAuth();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 });
  }

  try {
    const orderId = params.id;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                nameVi: true,
                nameEn: true,
                slug: true,
                imageSrc: true,
                available: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderHistory: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        orderDiscounts: {
          include: {
            discount: true,
            discountCode: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT: Update an order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authCheck = await checkAdminAuth();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 });
  }

  try {
    const orderId = params.id;

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const body = await request.json();

    // Validate input
    const validatedData = orderUpdateSchema.parse(body);

    // Prepare update data
    const updateData: any = {};

    if (validatedData.status !== undefined) {
      updateData.status = validatedData.status;

      // Set delivered timestamp if status is delivered
      if (validatedData.status === 'delivered' && !existingOrder.deliveredAt) {
        updateData.deliveredAt = new Date();
      }

      // Set cancelled timestamp if status is cancelled
      if (validatedData.status === 'cancelled' && !existingOrder.cancelledAt) {
        updateData.cancelledAt = new Date();
      }
    }

    if (validatedData.paymentStatus !== undefined) {
      updateData.paymentStatus = validatedData.paymentStatus;

      // Set paid timestamp if payment status is paid
      if (validatedData.paymentStatus === 'paid' && !existingOrder.paidAt) {
        updateData.paidAt = new Date();
      }
    }

    if (validatedData.trackingNumber !== undefined) {
      updateData.trackingNumber = validatedData.trackingNumber;
    }

    if (validatedData.estimatedDelivery !== undefined) {
      updateData.estimatedDelivery = validatedData.estimatedDelivery ? new Date(validatedData.estimatedDelivery) : null;
    }

    if (validatedData.adminNote !== undefined) {
      updateData.adminNote = validatedData.adminNote;
    }

    // Update the order
    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Create order history entry
    if (validatedData.status && validatedData.status !== existingOrder.status) {
      await prisma.orderHistory.create({
        data: {
          orderId: order.id,
          status: validatedData.status,
          note: validatedData.adminNote || `Order status changed to ${validatedData.status}`,
          createdBy: authCheck.session?.user?.email || 'admin',
        },
      });
    }

    return NextResponse.json({
      message: 'Order updated successfully',
      order,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
