import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function checkAdminAuth() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return { authorized: false, error: "Not authenticated" }
  }

  if (session.user.role !== "admin") {
    return { authorized: false, error: "Not authorized" }
  }

  return { authorized: true }
}

// GET: List all events
export async function GET(request: NextRequest) {
  const authCheck = await checkAdminAuth()
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    const events = await prisma.event.findMany({
      orderBy: { eventDate: "desc" },
    })

    return NextResponse.json({ events })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

// POST: Create new event
export async function POST(request: NextRequest) {
  const authCheck = await checkAdminAuth()
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    const body = await request.json()

    const event = await prisma.event.create({
      data: {
        titleVi: body.titleVi,
        titleEn: body.titleEn,
        descriptionVi: body.descriptionVi,
        descriptionEn: body.descriptionEn,
        slug: body.slug,
        image: body.image || null,
        eventDate: new Date(body.eventDate),
        eventTime: body.eventTime || null,
        locationVi: body.locationVi || null,
        locationEn: body.locationEn || null,
        addressVi: body.addressVi || null,
        addressEn: body.addressEn || null,
        maxAttendees: body.maxAttendees ? parseInt(body.maxAttendees) : null,
        currentAttendees: 0,
        price: body.price ? parseFloat(body.price) : null,
        category: body.category || null,
        featured: body.featured || false,
        published: body.published || false,
        registrationUrl: body.registrationUrl || null,
      },
    })

    return NextResponse.json({ event }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating event:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create event" },
      { status: 500 }
    )
  }
}
