/**
 * Fetch ALL emails from Resend with proper pagination
 */

interface ResendEmail {
  id: string
  to: string[]
  from: string
  subject: string
  created_at: string
  last_event: string
}

async function fetchAllEmails() {
  const apiKey = process.env.RESEND_API_KEY || "re_Vdhpjcyg_JnRZKNS5eYJkHcT9thkAQZEV"

  let allEmails: ResendEmail[] = []
  let page = 0
  let hasMore = true

  console.log('Fetching ALL emails from Resend...\n')

  // Keep fetching until no more emails
  while (hasMore) {
    page++
    console.log(`Fetching page ${page}...`)

    const url = allEmails.length > 0
      ? `https://api.resend.com/emails?limit=100&cursor=${allEmails[allEmails.length - 1].id}`
      : `https://api.resend.com/emails?limit=100`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.data && data.data.length > 0) {
      allEmails = allEmails.concat(data.data)
      console.log(`  Got ${data.data.length} emails (total: ${allEmails.length})`)

      // Check if there are more
      hasMore = data.has_more || false

      if (!hasMore) {
        console.log('  No more emails available')
        break
      }
    } else {
      hasMore = false
      break
    }

    // Longer delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log(`\n✅ Total emails fetched: ${allEmails.length}`)

  // Find order-related emails
  const orderEmails = allEmails.filter(email =>
    email.subject.toLowerCase().includes('đơn hàng') ||
    email.subject.toLowerCase().includes('order') ||
    /\#\d+/.test(email.subject)
  )

  console.log(`\n📦 Order-related emails found: ${orderEmails.length}`)

  // Extract unique order numbers
  const orderNumbers = new Set<string>()

  orderEmails.forEach(email => {
    const match = email.subject.match(/#(\d+)/)
    if (match) {
      orderNumbers.add(match[1])
    }
  })

  console.log(`\n📋 Unique order numbers: ${Array.from(orderNumbers).sort().join(', ')}`)
  console.log(`\nOrder emails:`)

  orderEmails.forEach(email => {
    console.log(`  - ${email.subject} (${email.to[0]}) - ${email.created_at}`)
  })

  return {
    allEmails,
    orderEmails,
    orderNumbers: Array.from(orderNumbers)
  }
}

fetchAllEmails()
  .then(result => {
    console.log(`\n\n🎯 Summary:`)
    console.log(`Total emails: ${result.allEmails.length}`)
    console.log(`Order emails: ${result.orderEmails.length}`)
    console.log(`Unique orders: ${result.orderNumbers.length}`)
    console.log(`Order IDs: ${result.orderNumbers.join(', ')}`)
  })
  .catch(error => {
    console.error('Error:', error)
    process.exit(1)
  })
