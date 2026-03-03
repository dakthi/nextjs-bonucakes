import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/workshops - List all workshop registrations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workshopName = searchParams.get('workshopName');
    const attended = searchParams.get('attended');
    const location = searchParams.get('location');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (workshopName) {
      where.workshopName = { contains: workshopName, mode: 'insensitive' };
    }

    if (attended !== null && attended !== undefined) {
      where.attended = attended === 'true';
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    // Get total count
    const total = await prisma.workshopRegistration.count({ where });

    // Get registrations with customer data
    const registrations = await prisma.workshopRegistration.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            tags: true,
            marketingConsent: true,
          },
        },
      },
      orderBy: {
        registrationDate: 'desc',
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      registrations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching workshop registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workshop registrations' },
      { status: 500 }
    );
  }
}

// POST /api/admin/workshops - Create a new workshop registration
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      email,
      name,
      workshopName,
      workshopDate,
      age,
      location,
      phone,
      facebookLink,
      fbExperience,
      barriers,
      goals,
      specificQuestions,
      availability,
      referralSource,
      otherNotes,
    } = body;

    // Validate required fields
    if (!email || !name || !workshopName) {
      return NextResponse.json(
        { error: 'Email, name, and workshop name are required' },
        { status: 400 }
      );
    }

    // Find or create customer
    let customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name,
          email,
          phone,
          marketingConsent: true,
          consentedAt: new Date(),
          consentSource: 'workshop',
          tags: ['workshop_participant'],
        },
      });
    }

    // Create workshop registration
    const registration = await prisma.workshopRegistration.create({
      data: {
        customerId: customer.id,
        workshopName,
        workshopDate: workshopDate ? new Date(workshopDate) : null,
        age,
        location,
        phone,
        facebookLink,
        fbExperience,
        barriers,
        goals,
        specificQuestions,
        availability,
        referralSource,
        otherNotes,
      },
      include: {
        customer: true,
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error('Error creating workshop registration:', error);
    return NextResponse.json(
      { error: 'Failed to create workshop registration' },
      { status: 500 }
    );
  }
}
