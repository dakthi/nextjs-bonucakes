/**
 * Admin Testimonials API
 * GET: List all testimonials
 * POST: Create a new testimonial
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().optional(),
  image: z.string().optional(),
  contentVi: z.string().min(1, 'Vietnamese content is required'),
  contentEn: z.string().min(1, 'English content is required'),
  rating: z.number().min(1).max(5).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
});

async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { authorized: false, error: 'Not authenticated' };
  }
  if (session.user.role !== 'admin') {
    return { authorized: false, error: 'Not authorized' };
  }
  return { authorized: true };
}

export async function GET(request: NextRequest) {
  const authCheck = await checkAdminAuth();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const featured = searchParams.get('featured');

    const where: any = {};
    if (active !== null) where.active = active === 'true';
    if (featured !== null) where.featured = featured === 'true';

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await checkAdminAuth();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = testimonialSchema.parse(body);

    const testimonial = await prisma.testimonial.create({
      data: {
        name: validatedData.name,
        role: validatedData.role,
        image: validatedData.image,
        contentVi: validatedData.contentVi,
        contentEn: validatedData.contentEn,
        rating: validatedData.rating || 5,
        featured: validatedData.featured || false,
        active: validatedData.active !== false,
      },
    });

    return NextResponse.json({ message: 'Testimonial created successfully', testimonial }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
