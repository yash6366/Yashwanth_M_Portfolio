'use client'

import { useState, useRef } from 'react'
import { FiUploadCloud, FiCheckCircle, FiAlertCircle, FiDownload, FiArrowLeft } from 'react-icons/fi'
import Link from 'next/link'

export default function ResumeUploadPage() {
  const inputFileRef = useRef(null)
  const [blob, setBlob] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedFileName, setSelectedFileName] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFileName(file.name)
      setError(null)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    const file = inputFileRef.current?.files?.[0]
    if (!file) {
      setError('Please select a resume PDF file to upload.')
      return
    }

    try {
      setUploading(true)
      setError(null)

      const filename = file.name.endsWith('.pdf') ? file.name : `${file.name}.pdf`
      const response = await fetch(`/api/resume/upload?filename=${encodeURIComponent(filename)}`, {
        method: 'POST',
        body: file,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setBlob(data)
    } catch (err) {
      setError(err.message || 'An error occurred during upload.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080808',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'var(--font-geist-sans), sans-serif',
    }}>
      <div style={{
        maxWidth: '540px',
        width: '100%',
        background: 'rgba(20, 20, 20, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(20px)',
      }}>
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--accent)',
          fontSize: '0.8rem',
          fontWeight: '700',
          textDecoration: 'none',
          marginBottom: '1.5rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          <FiArrowLeft /> Back to Portfolio
        </Link>

        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: '900',
          letterSpacing: '-0.02em',
          margin: '0 0 0.5rem',
          color: '#fff',
        }}>
          Upload Resume to Vercel Blob
        </h1>
        <p style={{
          fontSize: '0.9rem',
          color: 'rgba(255, 255, 255, 0.5)',
          margin: '0 0 2rem',
          lineHeight: '1.6',
        }}>
          Upload your latest resume PDF directly to high-speed Vercel Blob CDN storage.
        </p>

        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div
            role="button"
            tabIndex={0}
            aria-label="Select resume PDF file"
            style={{
              border: '2px dashed rgba(247, 147, 30, 0.3)',
              borderRadius: '12px',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              background: 'rgba(247, 147, 30, 0.03)',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
            onClick={() => inputFileRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                inputFileRef.current?.click()
              }
            }}
          >
            <FiUploadCloud size={36} color="var(--accent)" style={{ margin: '0 auto 0.8rem', display: 'block' }} />
            <input
              ref={inputFileRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <p style={{ margin: '0 0 0.4rem', fontSize: '0.95rem', fontWeight: '700' }}>
              {selectedFileName ? selectedFileName : 'Click to select Resume PDF'}
            </p>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.4)' }}>
              PDF format (Max 4.5 MB)
            </span>
          </div>

          <button
            type="submit"
            disabled={uploading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: 'var(--accent)',
              color: '#000',
              fontWeight: '900',
              fontSize: '0.85rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '0.9rem',
              borderRadius: '8px',
              border: 'none',
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.7 : 1,
              transition: 'transform 0.2s',
            }}
          >
            {uploading ? 'Uploading to Vercel Blob...' : 'Upload to Vercel Blob'}
          </button>
        </form>

        {error && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}>
            <FiAlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {blob && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1.2rem',
            borderRadius: '8px',
            background: blob.warning ? 'rgba(247, 147, 30, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            border: blob.warning ? '1px solid rgba(247, 147, 30, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)',
            color: blob.warning ? 'var(--accent)' : '#4ade80',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
              <FiCheckCircle size={18} />
              <strong style={{ fontSize: '0.9rem' }}>{blob.warning ? 'Saved to Local Application!' : 'Upload Successful!'}</strong>
            </div>

            {blob.warning && (
              <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 0.8rem', lineHeight: '1.5' }}>
                {blob.warning}
              </p>
            )}

            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '0.8rem',
              borderRadius: '6px',
              marginBottom: '0.8rem',
              wordBreak: 'break-all',
              fontSize: '0.78rem',
              color: '#fff',
              fontFamily: 'var(--font-geist-mono), monospace',
            }}>
              {blob.url}
            </div>

            <a
              href={blob.url}
              target="_blank"
              rel="noopener noreferrer"
              download
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--accent)',
                fontSize: '0.8rem',
                fontWeight: '700',
                textDecoration: 'none',
              }}
            >
              <FiDownload size={14} /> Open / Download File
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
