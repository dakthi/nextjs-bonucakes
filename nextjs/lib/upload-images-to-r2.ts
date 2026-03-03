import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import * as fs from "fs"
import * as path from "path"

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
    const contentType = getContentType(localPath)

    await r2Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: fileContent,
        ContentType: contentType,
      })
    )

    console.log(`✅ Uploaded: ${s3Key}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to upload ${s3Key}:`, error)
    return false
  }
}

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  const contentTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  }
  return contentTypes[ext] || "application/octet-stream"
}

function findImageFiles(dir: string, baseDir: string, files: string[] = []): string[] {
  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)

    if (item.isDirectory()) {
      findImageFiles(fullPath, baseDir, files)
    } else if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase()
      if ([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(ext)) {
        files.push(fullPath)
      }
    }
  }

  return files
}

async function main() {
  console.log("🚀 Starting image upload to R2...\n")

  const publicDir = path.join(process.cwd(), "public")
  const imageDirs = [
    path.join(publicDir, "img"),
    path.join(publicDir, "images"),
  ]

  let uploadedCount = 0
  let skippedCount = 0
  let allFiles: string[] = []

  for (const dir of imageDirs) {
    if (fs.existsSync(dir)) {
      const files = findImageFiles(dir, publicDir)
      allFiles.push(...files)
    }
  }

  console.log(`Found ${allFiles.length} image files\n`)

  for (const file of allFiles) {
    // Remove 'public/' from the key to match the URL structure
    const relativePath = path.relative(publicDir, file)
    const s3Key = relativePath.replace(/\\/g, "/") // Convert Windows paths to Unix

    const success = await uploadFileToR2(file, s3Key)
    if (success) {
      uploadedCount++
    } else {
      skippedCount++
    }
  }

  console.log(`\n📊 Upload complete:`)
  console.log(`   ✅ Uploaded: ${uploadedCount}`)
  console.log(`   ⏭️  Failed: ${skippedCount}`)
}

main().catch((error) => {
  console.error("❌ Upload failed:", error)
  process.exit(1)
})
