import { NextResponse } from 'next/server'
import { head } from '@vercel/blob'
import fs from 'fs/promises'
import path from 'path'

export async function GET(request) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN

    // 1. Try Vercel Blob if configured
    if (token) {
      try {
        const blobDetails = await head('resume/Yashwanth-M-Resume.pdf', { token })
        if (blobDetails?.url) {
          return NextResponse.redirect(blobDetails.url)
        }
      } catch (err) {
        console.warn('Vercel Blob head lookup failed, falling back to local file:', err.message)
      }
    }

    // 2. Direct binary stream from public/resume/
    const filePath = path.join(process.cwd(), 'public', 'resume', 'Yashwanth-M-Resume.pdf')
    try {
      const fileBuffer = await fs.readFile(filePath)
      return new Response(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="Yashwanth-M-Resume.pdf"',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
      })
    } catch (fsErr) {
      console.warn('Direct file read failed, falling back to static URL redirect:', fsErr.message)
    }

    // 3. Fallback redirect using request origin
    const origin = request?.nextUrl?.origin || 'http://localhost:3000'
    return NextResponse.redirect(new URL('/resume/Yashwanth-M-Resume.pdf', origin))
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
