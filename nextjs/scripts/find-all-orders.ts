/**
 * Find ALL order emails from Resend by searching through all pages
 */

interface OrderEmail {
  id: string
  orderNumber: string
  subject: string
  to: string
  created_at: string
}

async function findAllOrders() {
  const apiKey = "re_Vdhpjcyg_JnRZKNS5eYJkHcT9thkAQZEV"
  const orders = new Map<string, OrderEmail>()

  let page = 0
  let totalEmails = 0
  let afterCursor: string | null = null
  let hasMore = true

  console.log('Searching for all order emails in Resend...\n')

  // Use cursor-based pagination with 'after' parameter
  while (hasMore) {
    page++

    const url: string = afterCursor
      ? `https://api.resend.com/emails?limit=100&after=${afterCursor}`
      : `https://api.resend.com/emails?limit=100`

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` }
    })

    if (!response.ok) {
      console.error(`API error on page ${page}: ${response.statusText}`)
      break
    }

    const data = await response.json()

    if (!data.data || data.data.length === 0) {
      console.log(`  Page ${page}: No more emails`)
      break
    }

    totalEmails += data.data.length
    let ordersThisPage = 0

    for (const email of data.data) {
      const match = email.subject.match(/#(\d+)/)
      if (match && (
        email.subject.includes('đơn hàng') ||
        email.subject.includes('Đơn hàng') ||
        email.subject.toLowerCase().includes('order')
      )) {
        const orderNumber = match[1]

        // Only keep customer confirmations, not admin notifications
        if (!email.to[0].includes('bonucakes@gmail.com')) {
          if (!orders.has(orderNumber)) {
            orders.set(orderNumber, {
              id: email.id,
              orderNumber,
              subject: email.subject,
              to: email.to[0],
              created_at: email.created_at
            })
            ordersThisPage++
          }
        }
      }
    }

    if (ordersThisPage > 0) {
      console.log(`  Page ${page}: Found ${ordersThisPage} orders (total: ${orders.size}, emails: ${totalEmails})`)
    } else if (page % 10 === 0) {
      console.log(`  Page ${page}: ${totalEmails} emails checked, ${orders.size} orders found so far`)
    }

    // Check if there are more emails to fetch
    hasMore = data.has_more || false
    if (hasMore) {
      // Use the last email ID as the cursor for next request
      afterCursor = data.data[data.data.length - 1].id
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300))
  }

  console.log(`\n✅ Search complete!`)
  console.log(`Total emails checked: ${totalEmails}`)
  console.log(`Unique orders found: ${orders.size}\n`)

  // Sort by order number
  const sortedOrders = Array.from(orders.values()).sort((a, b) =>
    parseInt(a.orderNumber) - parseInt(b.orderNumber)
  )

  console.log('📦 All Orders:\n')
  sortedOrders.forEach(order => {
    console.log(`Order #${order.orderNumber} - ${order.to} (${new Date(order.created_at).toLocaleDateString()})`)
  })

  console.log(`\n\nOrder IDs to fetch:\n${sortedOrders.map(o => o.id).join('\n')}`)

  return sortedOrders
}

findAllOrders().catch(console.error)
