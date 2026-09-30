import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url)
    const rawFilename = searchParams.get('filename') || 'Yashwanth-M-Resume.pdf'
    const safeFilename = rawFilename.endsWith('.pdf') ? rawFilename : `${rawFilename}.pdf`

    // Read the incoming file stream into a buffer
    const arrayBuffer = await request.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // In local development or as backup, also save to public/resume/
    try {
      const resumeDir = path.join(process.cwd(), 'public', 'resume')
      await fs.mkdir(resumeDir, { recursive: true })
      await fs.writeFile(path.join(resumeDir, 'Yashwanth-M-Resume.pdf'), buffer)
    } catch (fsErr) {
      console.warn('Local file write warning:', fsErr.message)
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN

    // Try Vercel Blob upload if token exists
    if (token) {
      try {
        const blob = await put(`resume/${safeFilename}`, buffer, {
          access: 'public',
          token: token,
          addRandomSuffix: false,
        })
        return NextResponse.json({
          ...blob,
          source: 'vercel-blob',
          message: 'Successfully uploaded to Vercel Blob CDN!',
        })
      } catch (blobErr) {
        console.error('Vercel Blob Upload Error:', blobErr.message)

        // If access denied, provide clear advice
        if (blobErr.message?.includes('Access denied')) {
          return NextResponse.json({
            url: `/resume/Yashwanth-M-Resume.pdf`,
            downloadUrl: `/resume/Yashwanth-M-Resume.pdf`,
            source: 'local-fallback',
            warning: 'Vercel Blob token is invalid or unlinked. The resume was saved locally to public/resume/Yashwanth-M-Resume.pdf. Run "npx vercel env pull .env.local" to sync your live Vercel Blob token.',
          })
        }
        throw blobErr
      }
    }

    // Fallback if no token configured
    return NextResponse.json({
      url: `/resume/Yashwanth-M-Resume.pdf`,
      downloadUrl: `/resume/Yashwanth-M-Resume.pdf`,
      source: 'local-storage',
      message: 'Resume updated locally in public/resume/Yashwanth-M-Resume.pdf',
    })
  } catch (error) {
    console.error('Upload handler error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process resume upload' },
      { status: 500 }
    )
  }
}
