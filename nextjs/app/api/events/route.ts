import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET: List all published events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")
    const category = searchParams.get("category")
    const upcoming = searchParams.get("upcoming")

    const where: any = {
      published: true,
    }

    if (featured === "true") {
      where.featured = true
    }

    if (category) {
      where.category = category
    }

    if (upcoming === "true") {
      where.eventDate = {
        gte: new Date(),
      }
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { eventDate: "asc" },
    })

    return NextResponse.json({ events })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
