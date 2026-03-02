/**
 * Admin Media Upload API
 * POST: Upload image/file to R2 storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToR2, isR2Configured } from '@/lib/r2-storage';
import { prisma } from '@/lib/prisma';

// Check if user is authenticated and is admin
async function checkAdminAuth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { authorized: false, error: 'Not authenticated' };
  }

  if (session.user.role !== 'admin') {
    return { authorized: false, error: 'Not authorized' };
  }

  return { authorized: true };
}

// Generate unique filename
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  return `${nameWithoutExt}-${timestamp}-${randomString}.${extension}`;
}

// POST: Upload file to R2
export async function POST(request: NextRequest) {
  const authCheck = await checkAdminAuth();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 });
  }

  try {
    // Check if R2 is configured
    if (!isR2Configured()) {
      return NextResponse.json(
        { error: 'R2 storage is not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';
    const altText = formData.get('altText') as string || '';
    const caption = formData.get('caption') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type (images only for now)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique filename
    const uniqueFilename = generateUniqueFilename(file.name);
    const key = `${folder}/${uniqueFilename}`;

    // Upload to R2
    const { url } = await uploadToR2(key, buffer, file.type, {
      originalName: file.name,
      uploadedBy: 'admin',
      uploadedAt: new Date().toISOString(),
    });

    // Save media record to database
    const media = await prisma.media.create({
      data: {
        filename: uniqueFilename,
        originalName: file.name,
        filePath: key,
        fileType: file.type,
        fileSize: file.size,
        altText: altText || null,
        caption: caption || null,
        storageType: 'r2',
      },
    });

    return NextResponse.json({
      message: 'File uploaded successfully',
      media: {
        id: media.id,
        filename: media.filename,
        url,
        filePath: media.filePath,
        fileType: media.fileType,
        fileSize: media.fileSize,
        altText: media.altText,
        caption: media.caption,
      },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
