import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import * as fs from "fs"
import * as path from "path"
import { config } from "dotenv"

// Load environment variables from .env.local or .env
config({ path: ".env.local" })
config({ path: ".env" })

const r2Client = new S3Client({
  region: process.env.R2_REGION || "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.R2_BUCKET_NAME!

async function uploadFileToR2(localPath: string, s3Key: string) {
  try {
    const fileContent = fs.readFileSync(localPath)

    await r2Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: fileContent,
        ContentType: "application/pdf",
      })
    )

    console.log(`✅ Uploaded: ${s3Key}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to upload ${s3Key}:`, error)
    return false
  }
}

async function main() {
  console.log("🚀 Starting course PDF upload to R2...\n")

  // Source: docs/courses folder (relative to project root, not nextjs)
  const projectRoot = path.resolve(process.cwd(), "..")
  const coursesDir = path.join(projectRoot, "docs", "courses")

  if (!fs.existsSync(coursesDir)) {
    console.error(`❌ Courses directory not found: ${coursesDir}`)
    process.exit(1)
  }

  const files = fs.readdirSync(coursesDir).filter(f => f.endsWith(".pdf"))

  console.log(`Found ${files.length} PDF files\n`)

  let uploadedCount = 0
  let failedCount = 0

  for (const file of files) {
    const localPath = path.join(coursesDir, file)
    const s3Key = `downloads/courses/${file}`

    const success = await uploadFileToR2(localPath, s3Key)
    if (success) {
      uploadedCount++
    } else {
      failedCount++
    }
  }

  console.log(`\n📊 Upload complete:`)
  console.log(`   ✅ Uploaded: ${uploadedCount}`)
  console.log(`   ❌ Failed: ${failedCount}`)

  if (uploadedCount > 0) {
    const publicUrl = process.env.R2_PUBLIC_URL || "https://static.bonucakes.com"
    console.log(`\n📎 PDFs are now available at:`)
    console.log(`   ${publicUrl}/downloads/courses/course-catalogue.pdf`)
    console.log(`   ${publicUrl}/downloads/courses/course-banh-mi.pdf`)
    console.log(`   etc.`)
  }
}

main().catch((error) => {
  console.error("❌ Upload failed:", error)
  process.exit(1)
})
