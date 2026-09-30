import { NextResponse } from 'next/server'
import { head } from '@vercel/blob'

export async function GET() {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (token) {
      try {
        const blobDetails = await head('resume/Yashwanth-M-Resume.pdf', { token })
        if (blobDetails?.url) {
          return NextResponse.redirect(blobDetails.url)
        }
      } catch {
        // Fallback to local static asset
      }
    }

    // Default redirect to local public asset
    return NextResponse.redirect(new URL('/resume/Yashwanth-M-Resume.pdf', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
