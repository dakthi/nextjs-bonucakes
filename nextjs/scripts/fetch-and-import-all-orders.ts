/**
 * Fetch full details for all orders and import them into the database
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const orderEmailIds = [
  'a6728899-6be1-4f16-95bc-ce0f53798874', // #0120
  '46de107e-dc35-47c6-afcd-9ff7614dc72e', // #0125
  'fec89753-b051-42f5-a81b-676fcf5584e4', // #0970
  '9f6060bc-3667-4292-97f6-601af0571a83', // #1117
  '6892dc32-2e90-4d8b-a721-14190cef79bf', // #1223
  'a0e12eec-ca52-4913-a4ba-a74417082bcb', // #1414
  '4dd881f5-71a0-451a-848b-2b5792cc633d', // #1554
  'e52680c4-adf9-4393-9f15-e95a40a06ffa', // #1625
  '7be21723-2230-4138-a49c-1b1637ecae6c', // #2583
  'bcb8852d-a966-4390-89ac-1d3702609ab4', // #3196
  '67c14088-b3c0-4313-8a3c-d9c1632c5489', // #4698
  '1bcf26e2-5b31-46f3-be86-2e1663956374', // #5237
  'c32ffd64-1952-42ba-a600-cef9bf00f805', // #5552
  '4994879f-13a1-479c-b710-f622a0052722', // #5643
  'c26611a2-482c-4fa6-abbf-7cfa59afae5c', // #6252
  'd1e33999-7a6b-41d5-bb8a-bedb7b8fc7ec', // #6476
  'e3df77d1-4962-4870-b8a5-be69be0057d4', // #6493
  'b3ea130a-215f-4db1-a3b4-342c97643ec1', // #6879
  '149b2b04-7726-43a6-86d9-3d8115c20a04', // #7458
  'bded1c89-5fe2-4e30-ba22-6ff00f611a13', // #7766
  '457c4776-e645-42d1-887b-1053c399c459', // #8063
  '994401bb-4899-4d10-820a-95a7c3b94b74', // #8870
  'bbd356cf-2d8b-4556-ac9f-90007c999850', // #9139
  '4ec27920-681d-4726-bd0c-6d27c949f01b', // #9958
]

interface ParsedOrder {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  items: Array<{
    productName: string
    quantity: number
    unitPrice: number
    subtotal: number
  }>
  subtotal: number
  shippingFee: number
  total: number
  orderDate: Date
}

function parseOrderFromEmail(email: any): ParsedOrder | null {
  try {
    const text = email.text || email.html

    // Extract order number
    const orderMatch = text.match(/#(\d+)/)
    if (!orderMatch) return null
    const orderNumber = orderMatch[1]

    // Extract customer name from greeting
    const nameMatch = text.match(/Xin chào\s+([^,]+),/)
    const customerName = nameMatch ? nameMatch[1].trim() : 'Unknown'

    // Extract customer email
    const customerEmail = email.to[0]

    // Extract order items - look for product quantities and prices
    // Pattern: "4x Bánh Mì Sài Gòn" followed by "£9 / ổ × 4 = £36"
    const items: Array<{productName: string, quantity: number, unitPrice: number, subtotal: number}> = []

    // Try to find item lines in the text
    const itemPattern = /(\d+)x\s+([^\n]+)\s+£(\d+)\s*\/[^×]+×\s*\d+\s*=\s*£(\d+)/g
    let itemMatch
    while ((itemMatch = itemPattern.exec(text)) !== null) {
      items.push({
        productName: itemMatch[2].trim(),
        quantity: parseInt(itemMatch[1]),
        unitPrice: parseInt(itemMatch[3]),
        subtotal: parseInt(itemMatch[4])
      })
    }

    // If no items found with that pattern, try simpler pattern
    if (items.length === 0) {
      const simplePattern = /(\d+)x\s+([^\n]+)/g
      while ((itemMatch = simplePattern.exec(text)) !== null) {
        const quantity = parseInt(itemMatch[1])
        const productName = itemMatch[2].trim()
        // Default to £9 for Bánh Mì
        const unitPrice = 9
        items.push({
          productName,
          quantity,
          unitPrice,
          subtotal: quantity * unitPrice
        })
      }
    }

    // Extract subtotal
    const subtotalMatch = text.match(/Tạm tính:\s*£(\d+)/)
    const subtotal = subtotalMatch ? parseInt(subtotalMatch[1]) : items.reduce((sum, item) => sum + item.subtotal, 0)

    // Extract shipping fee
    const shippingMatch = text.match(/Phí giao hàng[^£]*£(\d+)/)
    const shippingFee = shippingMatch ? parseInt(shippingMatch[1]) : 8

    // Extract total
    const totalMatch = text.match(/Tổng cộng:\s*£(\d+)/)
    const total = totalMatch ? parseInt(totalMatch[1]) : subtotal + shippingFee

    return {
      orderNumber,
      customerName,
      customerEmail,
      customerPhone: 'N/A', // Not in email content
      shippingAddress: 'UK', // Generic, not in email
      items,
      subtotal,
      shippingFee,
      total,
      orderDate: new Date(email.created_at)
    }
  } catch (error) {
    console.error('Error parsing email:', error)
    return null
  }
}

async function fetchAndImportOrders() {
  const apiKey = "re_Vdhpjcyg_JnRZKNS5eYJkHcT9thkAQZEV"

  console.log(`Fetching and importing ${orderEmailIds.length} orders...\n`)

  let imported = 0
  let skipped = 0
  let failed = 0

  // Find or create Bánh Mì product
  let product = await prisma.product.findFirst({
    where: { slug: "banh-mi-saigon" }
  })

  if (!product) {
    console.log('Creating Bánh Mì Sài Gòn product...')
    product = await prisma.product.create({
      data: {
        nameVi: "Bánh Mì Sài Gòn",
        nameEn: "Saigon Banh Mi",
        slug: "banh-mi-saigon",
        descriptionVi: "Bánh mì Việt Nam truyền thống với nhân đầy đủ",
        descriptionEn: "Traditional Vietnamese baguette with full fillings",
        price: 9,
        category: "Savory",
        featured: true,
        available: true,
        stock: 100,
        stockStatus: "in_stock",
        trackInventory: false
      }
    })
  }

  for (const emailId of orderEmailIds) {
    try {
      // Fetch email details
      const response = await fetch(`https://api.resend.com/emails/${emailId}`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      })

      if (!response.ok) {
        console.error(`Failed to fetch email ${emailId}: ${response.statusText}`)
        failed++
        continue
      }

      const email = await response.json()
      const orderData = parseOrderFromEmail(email)

      if (!orderData) {
        console.error(`Failed to parse order from email ${emailId}`)
        failed++
        continue
      }

      // Check if order already exists
      const existing = await prisma.order.findFirst({
        where: { orderNumber: orderData.orderNumber }
      })

      if (existing) {
        console.log(`⚠️  Order #${orderData.orderNumber} already exists - skipping`)
        skipped++
        continue
      }

      // Create order
      await prisma.order.create({
        data: {
          orderNumber: orderData.orderNumber,
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          customerPhone: orderData.customerPhone,
          shippingAddress: { address: orderData.shippingAddress, country: "UK" },
          billingAddress: { address: orderData.shippingAddress, country: "UK" },
          items: {
            create: orderData.items.map(item => ({
              productId: product!.id,
              productName: item.productName,
              quantity: item.quantity,
              price: item.unitPrice,
              subtotal: item.subtotal
            }))
          },
          subtotal: orderData.subtotal,
          shippingCost: orderData.shippingFee,
          total: orderData.total,
          currency: "GBP",
          paymentMethod: "bank_transfer",
          paymentStatus: "pending",
          status: "pending",
          createdAt: orderData.orderDate
        }
      })

      console.log(`✅ Order #${orderData.orderNumber} - ${orderData.customerName} (${orderData.customerEmail}) - £${orderData.total}`)
      imported++

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))

    } catch (error: any) {
      console.error(`❌ Failed to import order from email ${emailId}:`, error.message)
      failed++
    }
  }

  console.log(`\n✅ Import complete!`)
  console.log(`Imported: ${imported}`)
  console.log(`Skipped (already exists): ${skipped}`)
  console.log(`Failed: ${failed}`)
}

fetchAndImportOrders()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
