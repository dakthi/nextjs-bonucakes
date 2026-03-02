import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Initialize R2 client (R2 is S3-compatible)
const r2Client = new S3Client({
  region: process.env.R2_REGION || 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.R2_BUCKET_NAME || ''
const PUBLIC_URL = process.env.R2_PUBLIC_URL || ''

export function isR2Configured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  )
}

export async function uploadToR2(
  key: string,
  buffer: Buffer,
  contentType: string,
  metadata?: Record<string, string>
): Promise<{ key: string; url: string }> {
  if (!isR2Configured()) {
    throw new Error('R2 storage is not configured. Please set R2 environment variables.')
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    Metadata: metadata,
  })

  await r2Client.send(command)

  const url = PUBLIC_URL
    ? `${PUBLIC_URL}/${key}`
    : await getSignedUrl(r2Client, new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }), { expiresIn: 3600 * 24 * 7 })

  return { key, url }
}

export async function deleteFromR2(key: string): Promise<void> {
  if (!isR2Configured()) {
    throw new Error('R2 storage is not configured. Please set R2 environment variables.')
  }

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  await r2Client.send(command)
}

export async function getSignedUrlFromR2(key: string, expiresIn: number = 3600): Promise<string> {
  if (!isR2Configured()) {
    throw new Error('R2 storage is not configured. Please set R2 environment variables.')
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  return await getSignedUrl(r2Client, command, { expiresIn })
}
