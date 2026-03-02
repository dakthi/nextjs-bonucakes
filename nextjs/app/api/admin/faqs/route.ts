/**
 * Admin FAQs API
 * GET: List all FAQs
 * POST: Create a new FAQ
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const faqSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  questionVi: z.string().min(1, 'Vietnamese question is required'),
  questionEn: z.string().min(1, 'English question is required'),
  answerVi: z.string().min(1, 'Vietnamese answer is required'),
  answerEn: z.string().min(1, 'English answer is required'),
  displayOrder: z.number().optional(),
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
    const category = searchParams.get('category');
    const active = searchParams.get('active');

    const where: any = {};
    if (category) where.category = category;
    if (active !== null) where.active = active === 'true';

    const faqs = await prisma.faq.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ faqs });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await checkAdminAuth();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = faqSchema.parse(body);

    const faq = await prisma.faq.create({
      data: {
        category: validatedData.category,
        questionVi: validatedData.questionVi,
        questionEn: validatedData.questionEn,
        answerVi: validatedData.answerVi,
        answerEn: validatedData.answerEn,
        displayOrder: validatedData.displayOrder || 0,
        active: validatedData.active !== false,
      },
    });

    return NextResponse.json({ message: 'FAQ created successfully', faq }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Error creating FAQ:', error);
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}
