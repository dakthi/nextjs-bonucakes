/**
 * Contact Form API - Send contact inquiries via email
 * POST: Validate form data and send email to business owner
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

// Initialize Resend
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(apiKey);
}

// Email configuration
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Bonu F&B <noreply@chartedconsultants.com>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'bonucakes6@gmail.com';

// Validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  serviceInterest: z.enum([
    'b2b-consulting',
    'individual-courses',
    'business-setup',
    'other'
  ]),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// Service interest labels
const serviceLabels = {
  'b2b-consulting': {
    en: 'B2B Restaurant Consulting',
    vi: 'Tư vấn nhà hàng B2B'
  },
  'individual-courses': {
    en: 'Individual Courses',
    vi: 'Khóa học cá nhân'
  },
  'business-setup': {
    en: 'Business Model Setup',
    vi: 'Thiết lập mô hình kinh doanh'
  },
  'other': {
    en: 'Other',
    vi: 'Khác'
  }
};

// Generate email HTML for business owner
function generateOwnerEmailHTML(data: ContactFormData): string {
  const serviceLabelEn = serviceLabels[data.serviceInterest].en;
  const serviceLabelVi = serviceLabels[data.serviceInterest].vi;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #083121; background-color: #f8faf9; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 2px solid #fcc56c; border-radius: 8px; overflow: hidden;">
    <!-- Header -->
    <div style="background-color: #083121; color: #ffffff; padding: 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-family: 'Georgia', serif; color: #fcc56c;">
        New Contact Inquiry
      </h1>
      <p style="margin: 10px 0 0 0; color: #f8faf9; font-size: 14px;">
        Bonu F&B Culinary Consultation
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="font-size: 16px; margin-bottom: 30px; color: #4a5c52;">
        You have received a new inquiry from your culinary consultation website.
      </p>

      <!-- Contact Details -->
      <div style="background-color: #f8faf9; border-left: 4px solid #fcc56c; padding: 20px; margin-bottom: 20px;">
        <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #083121;">Contact Information</h2>

        <div style="margin-bottom: 12px;">
          <strong style="color: #4a5c52;">Name:</strong>
          <span style="color: #083121;">${data.name}</span>
        </div>

        <div style="margin-bottom: 12px;">
          <strong style="color: #4a5c52;">Email:</strong>
          <a href="mailto:${data.email}" style="color: #083121; text-decoration: none;">${data.email}</a>
        </div>

        ${data.phone ? `
        <div style="margin-bottom: 12px;">
          <strong style="color: #4a5c52;">Phone:</strong>
          <a href="tel:${data.phone}" style="color: #083121; text-decoration: none;">${data.phone}</a>
        </div>
        ` : ''}

        <div style="margin-bottom: 12px;">
          <strong style="color: #4a5c52;">Service Interest:</strong>
          <span style="color: #083121;">${serviceLabelEn} / ${serviceLabelVi}</span>
        </div>
      </div>

      <!-- Message -->
      <div style="background-color: #ffffff; border: 1px solid #fcc56c; border-radius: 4px; padding: 20px; margin-bottom: 20px;">
        <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #083121;">Message</h2>
        <p style="margin: 0; color: #4a5c52; white-space: pre-wrap;">${data.message}</p>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin-top: 30px;">
        <a href="mailto:${data.email}?subject=Re: ${serviceLabelEn} Inquiry"
           style="display: inline-block; background-color: #fcc56c; color: #083121; padding: 14px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">
          Reply to ${data.name}
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8faf9; padding: 20px 30px; text-align: center; border-top: 1px solid #fcc56c;">
      <p style="margin: 0; color: #4a5c52; font-size: 12px;">
        This email was sent from your contact form on bonucakes.com
      </p>
      <p style="margin: 5px 0 0 0; color: #4a5c52; font-size: 12px;">
        Bonu F&B - Culinary Consultation Services
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Generate plain text version for email clients that don't support HTML
function generateOwnerEmailText(data: ContactFormData): string {
  const serviceLabelEn = serviceLabels[data.serviceInterest].en;
  const serviceLabelVi = serviceLabels[data.serviceInterest].vi;

  return `
NEW CONTACT INQUIRY
Bonu F&B Culinary Consultation

CONTACT INFORMATION
-------------------
Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}\n` : ''}Service Interest: ${serviceLabelEn} / ${serviceLabelVi}

MESSAGE
-------
${data.message}

---
This email was sent from your contact form on bonucakes.com
Bonu F&B - Culinary Consultation Services
  `.trim();
}

// Rate limiting helper (simple in-memory store - consider using Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const limit = 5; // 5 submissions
  const windowMs = 60 * 60 * 1000; // per hour

  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

// POST: Handle contact form submission
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();

    // Validate with Zod
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Rate limiting check (use email as identifier)
    const rateLimitKey = `contact:${data.email}`;
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Get Resend client
    const resend = getResendClient();

    // Send email to business owner
    const emailResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Consultation Inquiry: ${serviceLabels[data.serviceInterest].en}`,
      html: generateOwnerEmailHTML(data),
      text: generateOwnerEmailText(data),
      replyTo: data.email,
    });

    if (!emailResult.data) {
      throw new Error('Failed to send email');
    }

    console.log(`[contact] Email sent successfully to ${ADMIN_EMAIL}, ID: ${emailResult.data.id}`);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your inquiry. We will get back to you soon.',
    });

  } catch (error) {
    console.error('Error processing contact form:', error);

    // Check if it's a Resend API error
    if (error instanceof Error && error.message.includes('RESEND_API_KEY')) {
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send your message. Please try again later.' },
      { status: 500 }
    );
  }
}
