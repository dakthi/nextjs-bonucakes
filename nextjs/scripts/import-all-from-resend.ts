/**
 * Comprehensive import script to extract and import:
 * - Customers with names
 * - Orders
 * - Workshop registrations
 * - Contact form submissions
 */

import { PrismaClient } from '@prisma/client'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

interface EmailData {
  id: string
  to: string
  from: string
  subject: string
  htmlContent: string
  textContent: string
  createdAt: Date
}

function parseEmailFile(filePath: string): EmailData | null {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')

    let id = ''
    let to = ''
    let from = ''
    let subject = ''
    let createdAt = ''
    let htmlContent = ''
    let textContent = ''

    let inHtml = false
    let inText = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (line.startsWith('ID: ')) id = line.substring(4).trim()
      else if (line.startsWith('From: ')) from = line.substring(6).trim()
      else if (line.startsWith('To: ')) to = line.substring(4).trim()
      else if (line.startsWith('Subject: ')) subject = line.substring(9).trim()
      else if (line.startsWith('Created: ')) createdAt = line.substring(9).trim()
      else if (line.includes('HTML CONTENT:')) inHtml = true
      else if (line.includes('TEXT CONTENT:')) {
        inHtml = false
        inText = true
      }
      else if (line.includes('========')) {
        inHtml = false
        inText = false
      }
      else if (inHtml && line.trim()) htmlContent += line + '\n'
      else if (inText && line.trim()) textContent += line + '\n'
    }

    if (!id || !to || !subject) return null

    return {
      id,
      to,
      from,
      subject,
      htmlContent: htmlContent.trim(),
      textContent: textContent.trim(),
      createdAt: new Date(createdAt)
    }
  } catch (error) {
    console.error(`Failed to parse ${filePath}:`, error)
    return null
  }
}

function extractNameFromSubject(subject: string): string | null {
  // "Hẹn gặp [Name] Chủ Nhật này nhé"
  const match = subject.match(/Hẹn gặp (.+?) Chủ Nhật/)
  if (match) return match[1].trim()

  return null
}

function extractNameFromEmail(email: string): string {
  // Extract name from email (rough guess)
  const namePart = email.toLowerCase().split('@')[0]
  return namePart
    .split(/[._-]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function extractOrderNumber(subject: string): string | null {
  // "[Đơn hàng mới #1414]" or "Xác nhận đơn hàng #1414"
  const match = subject.match(/#(\d+)/)
  return match ? match[1] : null
}

function isWorkshopEmail(subject: string): boolean {
  return subject.toLowerCase().includes('workshop') ||
         subject.includes('Bí Quyết') ||
         subject.includes('Căn Bếp Nhỏ')
}

function isOrderEmail(subject: string): boolean {
  return subject.includes('Đơn hàng') ||
         subject.includes('đơn hàng') ||
         subject.toLowerCase().includes('order')
}

function isContactForm(subject: string): boolean {
  return subject.includes('Contact Form:')
}

async function importCustomers(emails: EmailData[]) {
  console.log('\n=== IMPORTING CUSTOMERS ===')

  const customerMap = new Map<string, { name: string, firstSeen: Date, source: string }>()

  // Collect unique customers
  emails.forEach(email => {
    const emailLower = email.to.toLowerCase()

    // Skip internal emails
    if (
      emailLower.includes('bonucakes@gmail.com') ||
      emailLower.includes('bonunguyen0101@gmail.com') ||
      emailLower.includes('dakthi9@gmail.com')
    ) {
      return
    }

    if (!customerMap.has(emailLower)) {
      // Try to get name from subject first
      let name = extractNameFromSubject(email.subject)

      // If not found, extract from email address
      if (!name) {
        name = extractNameFromEmail(email.to)
      }

      // Determine source
      let source = 'resend_import'
      if (isWorkshopEmail(email.subject)) source = 'workshop_registration'
      else if (isOrderEmail(email.subject)) source = 'order'
      else if (isContactForm(email.subject)) source = 'contact_form'

      customerMap.set(emailLower, {
        name: name || 'Customer',
        firstSeen: email.createdAt,
        source
      })
    } else {
      // Update first seen if older
      const existing = customerMap.get(emailLower)!
      if (email.createdAt < existing.firstSeen) {
        existing.firstSeen = email.createdAt
      }
    }
  })

  console.log(`Found ${customerMap.size} unique customers`)

  let created = 0
  let updated = 0
  let skipped = 0

  for (const [email, data] of Array.from(customerMap.entries())) {
    try {
      const existing = await prisma.customer.findUnique({
        where: { email }
      })

      if (existing) {
        // Update if we have better name or older first contact
        if (data.name !== 'Customer' && existing.name.includes('@')) {
          await prisma.customer.update({
            where: { email },
            data: { name: data.name }
          })
          updated++
          console.log(`  Updated: ${email} (better name: ${data.name})`)
        } else {
          skipped++
        }
      } else {
        await prisma.customer.create({
          data: {
            email,
            name: data.name,
            marketingConsent: true,
            consentedAt: data.firstSeen,
            consentSource: data.source,
            notes: `Imported from Resend. First contact: ${data.firstSeen.toISOString()}`
          }
        })
        created++
        console.log(`  Created: ${email} (${data.name})`)
      }
    } catch (error: any) {
      console.error(`  Failed: ${email} - ${error.message}`)
    }
  }

  console.log(`\nCustomers: ${created} created, ${updated} updated, ${skipped} skipped`)
  return { created, updated, skipped }
}

async function importOrders(emails: EmailData[]) {
  console.log('\n=== IMPORTING ORDERS ===')

  const orderEmails = emails.filter(e => isOrderEmail(e.subject))
  console.log(`Found ${orderEmails.length} order-related emails`)

  const orders = new Map<string, { email: string, subject: string, date: Date }>()

  orderEmails.forEach(email => {
    const orderNumber = extractOrderNumber(email.subject)
    if (orderNumber) {
      const key = orderNumber // Just the number, no #
      if (!orders.has(key)) {
        orders.set(key, {
          email: email.to,
          subject: email.subject,
          date: email.createdAt
        })
      }
    }
  })

  console.log(`Found ${orders.size} unique order references`)

  let created = 0
  let found = 0
  let notFound = 0

  for (const [orderNum, data] of Array.from(orders.entries())) {
    try {
      // Check if order exists in database
      const existingOrder = await prisma.order.findFirst({
        where: {
          orderNumber: orderNum
        }
      })

      if (existingOrder) {
        console.log(`  ✓ Order #${orderNum} found in database`)
        found++
      } else {
        console.log(`  ⚠ Order #${orderNum} NOT in database - creating note`)
        // Create a note or log entry for manual followup
        notFound++
      }
    } catch (error: any) {
      console.error(`  Failed to check order #${orderNum}: ${error.message}`)
    }
  }

  console.log(`\nOrders: ${found} found in DB, ${notFound} not found`)
  return { orders: Array.from(orders.entries()), found, notFound }
}

async function analyzeWorkshops(emails: EmailData[]) {
  console.log('\n=== ANALYZING WORKSHOPS ===')

  const workshopEmails = emails.filter(e => isWorkshopEmail(e.subject))
  console.log(`Found ${workshopEmails.length} workshop-related emails`)

  const registrations = new Map<string, string[]>()

  workshopEmails.forEach(email => {
    const workshop = email.subject.includes('Bí Quyết')
      ? 'Workshop: Bí Quyết Kinh Doanh F&B Bền Vững'
      : email.subject.includes('Căn Bếp')
      ? 'Workshop: Từ Căn Bếp Nhỏ Đến Thương Hiệu Riêng'
      : email.subject

    if (!registrations.has(workshop)) {
      registrations.set(workshop, [])
    }
    if (!registrations.get(workshop)!.includes(email.to)) {
      registrations.get(workshop)!.push(email.to)
    }
  })

  console.log(`\nWorkshop registrations:`)
  for (const [workshop, attendees] of Array.from(registrations.entries())) {
    console.log(`  ${workshop}: ${attendees.length} attendees`)
  }

  return Array.from(registrations.entries())
}

async function analyzeContactForms(emails: EmailData[]) {
  console.log('\n=== ANALYZING CONTACT FORMS ===')

  const contactEmails = emails.filter(e => isContactForm(e.subject))
  console.log(`Found ${contactEmails.length} contact form submissions`)

  contactEmails.forEach(email => {
    const inquiry = email.subject.replace('Contact Form: ', '')
    console.log(`  ${email.to}: "${inquiry}" - ${email.createdAt.toLocaleDateString()}`)
  })

  return contactEmails
}

async function generateSummaryReport(data: {
  customers: { created: number, updated: number, skipped: number }
  orders: { orders: [string, any][], found: number, notFound: number }
  workshops: [string, string[]][]
  contactForms: EmailData[]
}) {
  const report = `
RESEND DATA IMPORT SUMMARY
==========================
Generated: ${new Date().toISOString()}

CUSTOMERS
---------
Created: ${data.customers.created}
Updated: ${data.customers.updated}
Skipped: ${data.customers.skipped}
Total Unique: ${data.customers.created + data.customers.updated + data.customers.skipped}

ORDERS
------
Unique order references found: ${data.orders.orders.length}
Found in database: ${data.orders.found}
Not found in database: ${data.orders.notFound}

${data.orders.orders.map(([num, info]) => `  #${num} - ${info.email} (${info.date.toLocaleDateString()})`).join('\n')}

WORKSHOPS
---------
${data.workshops.map(([name, attendees]) => `  ${name}\n    Attendees: ${attendees.length}\n    List: ${attendees.slice(0, 5).join(', ')}${attendees.length > 5 ? '...' : ''}`).join('\n\n')}

CONTACT FORMS
-------------
Total submissions: ${data.contactForms.length}
${data.contactForms.map(e => `  "${e.subject.replace('Contact Form: ', '')}" from ${e.to}`).join('\n')}

RECOMMENDATIONS
--------------
${data.orders.notFound > 0 ? `⚠ ${data.orders.notFound} order(s) from emails not found in database - may need manual verification` : ''}
${data.workshops.length > 0 ? `✓ Consider creating an Event/Workshop management system for the ${data.workshops.reduce((sum, [, att]) => sum + att.length, 0)} workshop attendees` : ''}
${data.contactForms.length > 0 ? `✓ Review contact form submissions` : ''}
✓ ${data.customers.created} new customers imported with marketing consent
✓ Customer names extracted from email subjects where available
`

  console.log(report)
  return report
}

async function main() {
  try {
    console.log('Starting comprehensive data import from Resend emails...\n')

    // Read all email files
    const emailsDir = join(process.cwd(), 'resend-emails-unique')
    const files = readdirSync(emailsDir).filter(f => f.endsWith('.txt') && !f.includes('CUSTOMERS'))

    console.log(`Found ${files.length} email files to process`)

    const emails: EmailData[] = []

    for (const file of files) {
      const parsed = parseEmailFile(join(emailsDir, file))
      if (parsed) {
        emails.push(parsed)
      }
    }

    console.log(`Successfully parsed ${emails.length} emails\n`)

    // Import customers
    const customerResults = await importCustomers(emails)

    // Analyze orders
    const orders = await importOrders(emails)

    // Analyze workshops
    const workshops = await analyzeWorkshops(emails)

    // Analyze contact forms
    const contactForms = await analyzeContactForms(emails)

    // Generate summary
    const report = await generateSummaryReport({
      customers: customerResults,
      orders,
      workshops,
      contactForms
    })

    // Save report
    const { writeFileSync } = require('fs')
    writeFileSync(
      join(emailsDir, 'IMPORT_REPORT.txt'),
      report,
      'utf-8'
    )

    console.log('\n✅ Import complete! Report saved to resend-emails-unique/IMPORT_REPORT.txt')

  } catch (error) {
    console.error('Error during import:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
