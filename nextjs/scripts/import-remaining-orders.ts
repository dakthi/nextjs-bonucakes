/**
 * Import the 2 orders that failed due to rate limiting
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const orderEmailIds = [
  '6892dc32-2e90-4d8b-a721-14190cef79bf', // #1223
  'e52680c4-adf9-4393-9f15-e95a40a06ffa', // #1625
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

    // Extract order items
    const items: Array<{productName: string, quantity: number, unitPrice: number, subtotal: number}> = []

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

    if (items.length === 0) {
      const simplePattern = /(\d+)x\s+([^\n]+)/g
      while ((itemMatch = simplePattern.exec(text)) !== null) {
        const quantity = parseInt(itemMatch[1])
        const productName = itemMatch[2].trim()
        const unitPrice = 9
        items.push({
          productName,
          quantity,
          unitPrice,
          subtotal: quantity * unitPrice
        })
      }
    }

    const subtotalMatch = text.match(/Tạm tính:\s*£(\d+)/)
    const subtotal = subtotalMatch ? parseInt(subtotalMatch[1]) : items.reduce((sum, item) => sum + item.subtotal, 0)

    const shippingMatch = text.match(/Phí giao hàng[^£]*£(\d+)/)
    const shippingFee = shippingMatch ? parseInt(shippingMatch[1]) : 8

    const totalMatch = text.match(/Tổng cộng:\s*£(\d+)/)
    const total = totalMatch ? parseInt(totalMatch[1]) : subtotal + shippingFee

    return {
      orderNumber,
      customerName,
      customerEmail,
      customerPhone: 'N/A',
      shippingAddress: 'UK',
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

async function importRemainingOrders() {
  const apiKey = "re_Vdhpjcyg_JnRZKNS5eYJkHcT9thkAQZEV"

  console.log(`Importing 2 remaining orders with longer delay...\n`)

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
      console.log(`Fetching email ${emailId}...`)

      // Wait 2 seconds before each request to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000))

      const response = await fetch(`https://api.resend.com/emails/${emailId}`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      })

      if (!response.ok) {
        console.error(`❌ Failed to fetch email ${emailId}: ${response.statusText}`)
        continue
      }

      const email = await response.json()
      const orderData = parseOrderFromEmail(email)

      if (!orderData) {
        console.error(`❌ Failed to parse order from email ${emailId}`)
        continue
      }

      const existing = await prisma.order.findFirst({
        where: { orderNumber: orderData.orderNumber }
      })

      if (existing) {
        console.log(`⚠️  Order #${orderData.orderNumber} already exists - skipping`)
        continue
      }

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

    } catch (error: any) {
      console.error(`❌ Failed to import order from email ${emailId}:`, error.message)
    }
  }

  console.log(`\n✅ Done!`)
}

importRemainingOrders()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
