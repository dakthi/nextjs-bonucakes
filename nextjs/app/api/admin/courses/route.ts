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

// GET: List all courses
export async function GET(request: NextRequest) {
  const authCheck = await checkAdminAuth()
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ courses })
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}

// POST: Create new course
export async function POST(request: NextRequest) {
  const authCheck = await checkAdminAuth()
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    const body = await request.json()

    const course = await prisma.course.create({
      data: {
        titleVi: body.titleVi,
        titleEn: body.titleEn,
        descriptionVi: body.descriptionVi,
        descriptionEn: body.descriptionEn,
        shortDescriptionVi: body.shortDescriptionVi || null,
        shortDescriptionEn: body.shortDescriptionEn || null,
        syllabusVi: body.syllabusVi || null,
        syllabusEn: body.syllabusEn || null,
        prerequisitesVi: body.prerequisitesVi || null,
        prerequisitesEn: body.prerequisitesEn || null,
        slug: body.slug,
        price: parseFloat(body.price),
        compareAtPrice: body.compareAtPrice ? parseFloat(body.compareAtPrice) : null,
        duration: parseInt(body.duration),
        durationUnit: body.durationUnit || "hours",
        level: body.level || "beginner",
        category: body.category || "cooking",
        maxStudents: body.maxStudents ? parseInt(body.maxStudents) : null,
        currentEnrollment: 0,
        instructor: body.instructor || null,
        instructorImage: body.instructorImage || null,
        instructorBio: body.instructorBio || null,
        image: body.image || null,
        images: body.images || [],
        videoUrl: body.videoUrl || null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        featured: body.featured || false,
        published: body.published || false,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
      },
    })

    return NextResponse.json({ course }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating course:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create course" },
      { status: 500 }
    )
  }
}
