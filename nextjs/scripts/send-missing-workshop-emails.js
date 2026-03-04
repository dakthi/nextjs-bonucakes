const { PrismaClient } = require('@prisma/client');
const { Resend } = require('resend');

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// Emails that were sent according to Resend
const sentEmails = [
  'fionatranle1976@gmail.com',
  'ptyn92@gmail.com',
  'nguyenthuha.nhitb@gmail.com',
  'Duong.vwoek@gmail.com', // bounced
  'doanhuongcuc1993@gmail.com',
  'Miumeobg@yahoo.com',
  'nguyenphamanhkhoa1807@gmail.com',
  'Tinhvuba239@gmail.com'
].map(e => e.toLowerCase());

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function sendMissingEmails() {
  try {
    // Get the latest campaign
    const campaign = await prisma.emailCampaign.findFirst({
      orderBy: { sentAt: 'desc' },
      include: {
        recipients: {
          include: {
            customer: true
          }
        }
      }
    });

    console.log(`Campaign: ${campaign.name}`);
    console.log(`Total recipients: ${campaign.recipients.length}\n`);

    // Get the template
    const template = await prisma.emailTemplate.findFirst({
      where: {
        htmlContent: campaign.htmlTemplate
      }
    });

    let successCount = 0;
    let failedCount = 0;

    for (const recipient of campaign.recipients) {
      const customer = recipient.customer;

      // Skip if already sent
      if (sentEmails.includes(customer.email.toLowerCase())) {
        console.log(`⏭  Skipping ${customer.email} (already sent)`);
        continue;
      }

      try {
        // Replace placeholders
        const personalizedHtml = campaign.htmlTemplate
          .replace(/{name}/g, customer.name)
          .replace(/{email}/g, customer.email);

        // Send email
        const result = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@chartedconsultants.com',
          to: customer.email,
          subject: campaign.subject,
          html: personalizedHtml,
        });

        if (result.error) {
          console.error(`✗ Failed ${customer.email}:`, result.error);
          failedCount++;
        } else {
          console.log(`✓ Sent to ${customer.email} (ID: ${result.data?.id})`);
          successCount++;
        }

        // Wait 500ms between emails to avoid rate limiting
        await delay(500);
      } catch (error) {
        console.error(`✗ Error sending to ${customer.email}:`, error.message);
        failedCount++;

        // If rate limited, wait longer
        if (error.statusCode === 429) {
          console.log('⏳ Rate limited, waiting 3 seconds...');
          await delay(3000);
        }
      }
    }

    console.log(`\n✅ Complete: ${successCount} sent, ${failedCount} failed`);
    await prisma.$disconnect();
  } catch (error) {
    console.error('Script error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

sendMissingEmails();
