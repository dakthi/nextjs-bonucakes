/**
 * Sync customer data with their orders
 * Updates totalSpent, totalOrders, lastOrderDate, tags, and segment for each customer
 */

import { PrismaClient } from '@prisma/client'
import { generateOrderTags, mergeTags, calculateSegment } from '../lib/auto-tagging'

const prisma = new PrismaClient()

async function syncCustomerOrders() {
  console.log('Syncing customer data with orders...\n')

  try {
    // Get all customers
    const customers = await prisma.customer.findMany()
    console.log(`Found ${customers.length} customers`)

    // Get all orders
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        customerEmail: true,
        customerName: true,
        total: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    console.log(`Found ${orders.length} orders\n`)

    let updated = 0
    let created = 0
    let errors = 0

    // Group orders by customer email
    const ordersByEmail = new Map<string, typeof orders>()
    for (const order of orders) {
      const email = order.customerEmail.toLowerCase()
      if (!ordersByEmail.has(email)) {
        ordersByEmail.set(email, [])
      }
      ordersByEmail.get(email)!.push(order)
    }

    console.log(`Orders grouped by ${ordersByEmail.size} unique emails\n`)

    // Process each customer
    for (const [email, customerOrders] of Array.from(ordersByEmail.entries())) {
      try {
        const totalOrders = customerOrders.length
        const totalSpent = customerOrders.reduce((sum, order) => sum + Number(order.total), 0)
        const lastOrderDate = customerOrders[0].createdAt // Already sorted by desc

        // Find or create customer
        let customer = customers.find(c => c.email.toLowerCase() === email)

        // Generate order-based tags
        const orderTags = generateOrderTags(totalOrders, totalSpent)

        // Calculate segment
        const segment = calculateSegment(totalOrders, totalSpent, lastOrderDate)

        if (customer) {
          // Update existing customer with auto-tagging
          const existingTags = customer.tags || []
          const updatedTags = mergeTags(existingTags, orderTags)

          await prisma.customer.update({
            where: { id: customer.id },
            data: {
              totalOrders,
              totalSpent,
              lastOrderDate,
              tags: updatedTags,
              segment,
            }
          })
          console.log(`✅ Updated: ${customer.name} (${email}) - ${totalOrders} orders, £${totalSpent.toFixed(2)}, segment: ${segment}, tags: ${orderTags.join(', ')}`)
          updated++
        } else {
          // Create new customer from order data with auto-tagging
          const firstOrder = customerOrders[customerOrders.length - 1] // Oldest order
          customer = await prisma.customer.create({
            data: {
              name: firstOrder.customerName,
              email: email,
              phone: null,
              marketingConsent: false,
              consentSource: 'order',
              totalOrders,
              totalSpent,
              lastOrderDate,
              tags: orderTags,
              segment,
            }
          })
          console.log(`✨ Created: ${customer.name} (${email}) - ${totalOrders} orders, £${totalSpent.toFixed(2)}, segment: ${segment}, tags: ${orderTags.join(', ')}`)
          created++
        }
      } catch (error: any) {
        console.error(`❌ Error processing ${email}:`, error.message)
        errors++
      }
    }

    // Reset customers with no orders
    const customersWithoutOrders = customers.filter(c => !ordersByEmail.has(c.email.toLowerCase()))
    for (const customer of customersWithoutOrders) {
      if (customer.totalOrders > 0 || Number(customer.totalSpent) > 0) {
        await prisma.customer.update({
          where: { id: customer.id },
          data: {
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: null,
          }
        })
        console.log(`🔄 Reset: ${customer.name} (${customer.email}) - no orders found`)
      }
    }

    console.log(`\n✅ Sync complete!`)
    console.log(`Updated: ${updated}`)
    console.log(`Created: ${created}`)
    console.log(`Errors: ${errors}`)

  } catch (error) {
    console.error('Sync failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

syncCustomerOrders()
