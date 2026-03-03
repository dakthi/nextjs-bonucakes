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

// GET: List all reviews
export async function GET(request: NextRequest) {
  const authCheck = await checkAdminAuth()
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const approved = searchParams.get("approved")

    const where: any = {}
    if (approved === "true") {
      where.approved = true
    } else if (approved === "false") {
      where.approved = false
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            nameEn: true,
            nameVi: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Transform to include product name
    const transformedReviews = reviews.map((review) => ({
      id: review.id,
      productId: review.productId,
      productName: review.product?.nameEn || "Unknown Product",
      customerName: review.name,
      customerEmail: review.email,
      rating: review.rating,
      comment: review.comment,
      approved: review.approved,
      createdAt: review.createdAt,
    }))

    return NextResponse.json({ reviews: transformedReviews })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}
