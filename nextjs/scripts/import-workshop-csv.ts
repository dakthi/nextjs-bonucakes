import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

interface WorkshopCSVRow {
  'Dấu thời gian': string;
  'Bạn có thể tham dự workshop vào thời gian nào? ': string;
  '1. Họ tên của bạn?': string;
  '2. Bạn sinh năm bao nhiêu?': string;
  '3. Email của bạn?': string;
  '4. Số điện thoại của bạn (WhatsApp hoặc Zalo nếu có)?': string;
  '5.  Bạn biết đến workshop này qua đâu? ': string;
  '  6. Mong muốn của bạn khi đến với WS này là gì?': string;
  '7. Bạn có điều gì muốn nhắn nhủ hoặc đặt câu hỏi trước cho Bo không?  ': string;
  '0. Bạn đến từ đâu?': string;
  'Hãy tham gia nhóm này để nhận các thông báo cập nhật cũng như quà tặng sau buổi workshop nhé : ': string;
  [key: string]: string; // Allow any additional columns
}

// Auto-tagging logic based on workshop registration data
function generateTags(row: WorkshopCSVRow): string[] {
  const tags: string[] = ['workshop_participant', 'workshop_march_2026'];

  // Location-based tags
  const location = row['0. Bạn đến từ đâu?']?.toLowerCase() || '';
  if (location.includes('uk') || location.includes('anh')) {
    tags.push('uk_based');
  } else if (location.includes('việt nam') || location.includes('vietnam')) {
    tags.push('vietnam_based');
  } else if (location.includes('úc') || location.includes('australia')) {
    tags.push('australia_based');
  } else if (location.includes('pháp') || location.includes('france')) {
    tags.push('france_based');
  }

  // Referral source tags
  const referralSource = row['5.  Bạn biết đến workshop này qua đâu? ']?.toLowerCase() || '';
  if (referralSource.includes('facebook cá nhân')) {
    tags.push('referral_facebook_personal');
  } else if (referralSource.includes('group') || referralSource.includes('cộng đồng')) {
    tags.push('referral_facebook_group');
  } else if (referralSource.includes('người quen')) {
    tags.push('referral_word_of_mouth');
  } else if (referralSource.includes('zalo')) {
    tags.push('referral_zalo');
  }

  // Goals-based tags
  const goals = row['  6. Mong muốn của bạn khi đến với WS này là gì?']?.toLowerCase() || '';
  if (goals.includes('hiểu rõ bản thân')) {
    tags.push('goal_self_understanding');
  }
  if (goals.includes('biết cách lập mục tiêu')) {
    tags.push('goal_learn_planning');
  }
  if (goals.includes('biết triển khai')) {
    tags.push('goal_implementation');
  }
  if (goals.includes('công cụ')) {
    tags.push('goal_tools');
  }

  return tags;
}

async function importWorkshopCSV(csvFilePath: string) {
  console.log('Starting workshop CSV import...');

  // Read CSV file
  const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    bom: true, // Handle UTF-8 BOM
  }) as WorkshopCSVRow[];

  console.log(`Found ${records.length} registrations to import`);

  let imported = 0;
  let updated = 0;
  let errors = 0;

  for (const row of records) {
    try {
      const email = row['3. Email của bạn?']?.trim();
      const name = row['1. Họ tên của bạn?']?.trim();

      if (!email || !name) {
        console.warn(`Skipping row with missing email or name`);
        errors++;
        continue;
      }

      // Parse registration date
      const registrationDate = new Date(row['Dấu thời gian']);

      // Find or create customer
      let customer = await prisma.customer.findUnique({
        where: { email },
      });

      const tags = generateTags(row);

      if (!customer) {
        // Create new customer
        customer = await prisma.customer.create({
          data: {
            name,
            email,
            phone: row['4. Số điện thoại của bạn (WhatsApp hoặc Zalo nếu có)?'] || null,
            marketingConsent: true,
            consentedAt: registrationDate,
            consentSource: 'workshop',
            tags,
          },
        });
        console.log(`Created customer: ${email}`);
      } else {
        // Update existing customer with new tags (merge with existing)
        const existingTags = customer.tags || [];
        const mergedTags = Array.from(new Set([...existingTags, ...tags]));

        await prisma.customer.update({
          where: { id: customer.id },
          data: {
            tags: mergedTags,
            marketingConsent: true,
            consentedAt: customer.consentedAt || registrationDate,
            consentSource: customer.consentSource || 'workshop',
          },
        });
        console.log(`Updated customer tags: ${email}`);
      }

      // Create workshop registration
      const existingRegistration = await prisma.workshopRegistration.findFirst({
        where: {
          customerId: customer.id,
          workshopName: 'Triển khai và thiết lập mục tiêu',
        },
      });

      if (!existingRegistration) {
        await prisma.workshopRegistration.create({
          data: {
            customerId: customer.id,
            workshopName: 'Triển khai và thiết lập mục tiêu',
            workshopDate: new Date('2026-03-04'),
            registrationDate,
            age: row['2. Bạn sinh năm bao nhiêu?'] || null,
            location: row['0. Bạn đến từ đâu?'] || null,
            phone: row['4. Số điện thoại của bạn (WhatsApp hoặc Zalo nếu có)?'] || null,
            referralSource: row['5.  Bạn biết đến workshop này qua đâu? '] || null,
            goals: row['  6. Mong muốn của bạn khi đến với WS này là gì?'] || null,
            specificQuestions: row['7. Bạn có điều gì muốn nhắn nhủ hoặc đặt câu hỏi trước cho Bo không?  '] || null,
            availability: row['Bạn có thể tham dự workshop vào thời gian nào? '] || null,
            attended: false,
          },
        });
        imported++;
        console.log(`✓ Imported registration for: ${name} (${email})`);
      } else {
        updated++;
        console.log(`⊙ Registration already exists for: ${email}`);
      }
    } catch (error) {
      errors++;
      console.error(`Error processing row:`, error);
      console.error('Row data:', row);
    }
  }

  console.log('\n=== Import Summary ===');
  console.log(`Total rows: ${records.length}`);
  console.log(`Imported: ${imported}`);
  console.log(`Already existed: ${updated}`);
  console.log(`Errors: ${errors}`);
}

async function main() {
  const csvPath = process.argv[2];

  if (!csvPath) {
    console.error('Usage: tsx scripts/import-workshop-csv.ts <path-to-csv>');
    process.exit(1);
  }

  if (!fs.existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`);
    process.exit(1);
  }

  try {
    await importWorkshopCSV(csvPath);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
