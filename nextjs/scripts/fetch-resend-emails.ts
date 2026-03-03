/**
 * Script to fetch all Bonu-related emails from Resend API
 * and save them to files for processing
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

interface ResendEmail {
  id: string
  to: string[]
  from: string
  subject: string
  html?: string
  text?: string
  created_at: string
  last_event: string
}

interface ResendResponse {
  object: string
  has_more: boolean
  data: ResendEmail[]
}

async function fetchAllBonuEmails() {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.error('Error: RESEND_API_KEY environment variable not set')
    process.exit(1)
  }

  console.log('Fetching emails from Resend API...')

  let hasMore = true
  let allEmails: ResendEmail[] = []
  let page = 0

  // Fetch all emails (with safety limit)
  while (hasMore && allEmails.length < 5000) {
    console.log(`Fetching page ${page + 1}...`)

    const response = await fetch(
      `https://api.resend.com/emails?limit=100`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.statusText}`)
    }

    const data: ResendResponse = await response.json()
    allEmails = allEmails.concat(data.data)
    hasMore = data.has_more
    page++

    console.log(`  Progress: ${allEmails.length} emails fetched, hasMore: ${hasMore}`)

    // Small delay to avoid rate limiting
    if (hasMore) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  console.log(`Fetched ${allEmails.length} total emails`)

  // Filter for Bonu-related emails
  const bonuEmails = allEmails.filter(email =>
    email.from.toLowerCase().includes('bonu') ||
    email.subject.toLowerCase().includes('bonu') ||
    email.to.some(recipient => recipient.toLowerCase().includes('bonu'))
  )

  console.log(`Found ${bonuEmails.length} Bonu-related emails`)

  // Create output directory
  const outputDir = join(process.cwd(), 'resend-emails-export')
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  // Save each email to a file
  bonuEmails.forEach((email, index) => {
    const timestamp = new Date(email.created_at).toISOString().replace(/:/g, '-')
    const filename = `${index + 1}_${timestamp}_${email.id}.txt`
    const filepath = join(outputDir, filename)

    const content = `
========================================
EMAIL ${index + 1}
========================================

ID: ${email.id}
From: ${email.from}
To: ${email.to.join(', ')}
Subject: ${email.subject}
Created: ${email.created_at}
Last Event: ${email.last_event}

----------------------------------------
HTML CONTENT:
----------------------------------------
${email.html || 'No HTML content'}

----------------------------------------
TEXT CONTENT:
----------------------------------------
${email.text || 'No text content'}

========================================
`

    writeFileSync(filepath, content, 'utf-8')
    console.log(`Saved: ${filename}`)
  })

  // Create summary file
  const summaryContent = `
RESEND EMAIL EXPORT SUMMARY
===========================

Total emails fetched: ${allEmails.length}
Bonu-related emails: ${bonuEmails.length}
Export date: ${new Date().toISOString()}

EMAILS LIST:
${bonuEmails.map((email, i) => `
${i + 1}. ${email.subject}
   From: ${email.from}
   To: ${email.to.join(', ')}
   Date: ${email.created_at}
   ID: ${email.id}
`).join('\n')}
`

  const summaryPath = join(outputDir, '_SUMMARY.txt')
  writeFileSync(summaryPath, summaryContent, 'utf-8')
  console.log(`\nSummary saved to: ${summaryPath}`)
  console.log(`All emails saved to: ${outputDir}`)
}

// Run the script
fetchAllBonuEmails().catch(error => {
  console.error('Error:', error)
  process.exit(1)
})
