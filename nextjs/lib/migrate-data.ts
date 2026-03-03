import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface ProductJSON {
  id: string
  slug: string
  name: {
    vi: string
    en: string
  }
  shortDescription: {
    vi: string
    en: string
  }
  description: {
    vi: string
    en: string
  }
  images: string[]
  price: {
    amount: number
    currency: string
    displayPrice: string
    displayPriceVi: string
    unit: { en: string; vi: string }
  }
  promotion?: {
    vi: string
    en: string
  }
  ingredients?: {
    vi: string[]
    en: string[]
  }
  packaging?: {
    vi: string
    en: string
  }
  usageInstructions?: any
  deliveryInfo?: {
    vi: string
    en: string
  }
  available: boolean
  featured: boolean
  sortOrder: number
}

interface PostJSON {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  image?: string
  date: string
  status: string
}

async function migrateProducts() {
  console.log('🔄 Starting product migration...')

  const productsFile = path.join(process.cwd(), 'public', 'products.json')
  const productsData = JSON.parse(fs.readFileSync(productsFile, 'utf-8'))
  const products: ProductJSON[] = productsData.products

  let successCount = 0
  let skipCount = 0

  for (const product of products) {
    try {
      // Check if product already exists
      const existing = await prisma.product.findUnique({
        where: { slug: product.slug }
      })

      if (existing) {
        console.log(`⏭️  Skipping existing product: ${product.name.en}`)
        skipCount++
        continue
      }

      // Transform ingredients arrays to text
      const ingredientsEn = product.ingredients?.en ? product.ingredients.en.join('\n') : null
      const ingredientsVi = product.ingredients?.vi ? product.ingredients.vi.join('\n') : null

      // Create how-to-use from usageInstructions
      let howToUseEn = null
      let howToUseVi = null

      if (product.usageInstructions) {
        const sections: string[] = []
        const sectionsVi: string[] = []

        if (product.usageInstructions.storage) {
          sections.push(`Storage: ${product.usageInstructions.storage.en}`)
          sectionsVi.push(`Bảo quản: ${product.usageInstructions.storage.vi}`)
        }

        if (product.usageInstructions.preparation || product.usageInstructions.reheating) {
          const prep = product.usageInstructions.preparation || product.usageInstructions.reheating
          if (prep.en) {
            sections.push(`Preparation:\n${Array.isArray(prep.en) ? prep.en.join('\n') : prep.en}`)
          }
          if (prep.vi) {
            sectionsVi.push(`Chuẩn bị:\n${Array.isArray(prep.vi) ? prep.vi.join('\n') : prep.vi}`)
          }
        }

        if (product.usageInstructions.preparingFillings) {
          sections.push(`Preparing Fillings:\n${Array.isArray(product.usageInstructions.preparingFillings.en) ? product.usageInstructions.preparingFillings.en.join('\n') : product.usageInstructions.preparingFillings.en}`)
          sectionsVi.push(`Chuẩn bị nhân:\n${Array.isArray(product.usageInstructions.preparingFillings.vi) ? product.usageInstructions.preparingFillings.vi.join('\n') : product.usageInstructions.preparingFillings.vi}`)
        }

        if (product.usageInstructions.assembly) {
          sections.push(`Assembly:\n${Array.isArray(product.usageInstructions.assembly.en) ? product.usageInstructions.assembly.en.join('\n') : product.usageInstructions.assembly.en}`)
          sectionsVi.push(`Lắp ráp:\n${Array.isArray(product.usageInstructions.assembly.vi) ? product.usageInstructions.assembly.vi.join('\n') : product.usageInstructions.assembly.vi}`)
        }

        howToUseEn = sections.length > 0 ? sections.join('\n\n') : null
        howToUseVi = sectionsVi.length > 0 ? sectionsVi.join('\n\n') : null
      }

      // Add packaging and delivery info to description
      let fullDescEn = product.description.en
      let fullDescVi = product.description.vi

      if (product.packaging) {
        fullDescEn += `\n\nPackaging: ${product.packaging.en}`
        fullDescVi += `\n\nĐóng gói: ${product.packaging.vi}`
      }

      if (product.deliveryInfo) {
        if (product.deliveryInfo.en) fullDescEn += `\n\nDelivery: ${product.deliveryInfo.en}`
        if (product.deliveryInfo.vi) fullDescVi += `\n\nGiao hàng: ${product.deliveryInfo.vi}`
      }

      // Create product
      await prisma.product.create({
        data: {
          slug: product.slug,
          nameEn: product.name.en,
          nameVi: product.name.vi,
          shortDescriptionEn: product.shortDescription.en,
          shortDescriptionVi: product.shortDescription.vi,
          descriptionEn: fullDescEn,
          descriptionVi: fullDescVi,
          price: product.price.amount,
          images: product.images,

          // Optional fields
          ingredientsEn: ingredientsEn,
          ingredientsVi: ingredientsVi,
          howToUseEn: howToUseEn,
          howToUseVi: howToUseVi,

          available: product.available,
          featured: product.featured,
          category: 'food',
          stock: product.available ? 100 : 0,
          stockStatus: product.available ? 'in_stock' : 'out_of_stock',
        }
      })

      console.log(`✅ Migrated product: ${product.name.en}`)
      successCount++
    } catch (error) {
      console.error(`❌ Error migrating product ${product.name.en}:`, error)
    }
  }

  console.log(`\n📊 Product migration complete:`)
  console.log(`   ✅ Migrated: ${successCount}`)
  console.log(`   ⏭️  Skipped: ${skipCount}`)
}

async function migrateBlogPosts() {
  console.log('\n🔄 Starting blog post migration...')

  const postsFile = path.join(process.cwd(), 'public', 'posts.json')
  const posts: PostJSON[] = JSON.parse(fs.readFileSync(postsFile, 'utf-8'))

  let successCount = 0
  let skipCount = 0

  for (const post of posts) {
    try {
      // Check if post already exists
      const existing = await prisma.blogPost.findUnique({
        where: { slug: post.slug }
      })

      if (existing) {
        console.log(`⏭️  Skipping existing post: ${post.title.substring(0, 50)}...`)
        skipCount++
        continue
      }

      // Parse date
      const publishedAt = post.date ? new Date(post.date) : new Date()

      // Create blog post (assuming content is in Vietnamese by default)
      await prisma.blogPost.create({
        data: {
          slug: post.slug,
          titleVi: post.title,
          titleEn: post.title, // Use same title for English if not provided
          excerptVi: post.excerpt || post.content.substring(0, 200),
          excerptEn: post.excerpt || post.content.substring(0, 200),
          contentVi: post.content,
          contentEn: post.content, // Use same content for English if not provided
          image: post.image || '',
          published: post.status === 'published',
          publishedAt: publishedAt,
          category: 'general', // Default category
          tags: [],
          views: 0,
        }
      })

      console.log(`✅ Migrated post: ${post.title.substring(0, 50)}...`)
      successCount++
    } catch (error) {
      console.error(`❌ Error migrating post ${post.title.substring(0, 50)}:`, error)
    }
  }

  console.log(`\n📊 Blog post migration complete:`)
  console.log(`   ✅ Migrated: ${successCount}`)
  console.log(`   ⏭️  Skipped: ${skipCount}`)
}

async function main() {
  console.log('🚀 Starting data migration from HTML to Next.js database...\n')

  try {
    // Migrate products
    await migrateProducts()

    // Migrate blog posts
    await migrateBlogPosts()

    console.log('\n✨ Migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
