'use client'

import { useRef, useState } from 'react'
import { Check, Download, FileSpreadsheet, FileText, LockKeyhole, RefreshCw, ShieldCheck, Upload, X } from 'lucide-react'

const MAX_SIZE = 25 * 1024 * 1024

type Status = 'idle' | 'ready' | 'converting' | 'complete' | 'error'

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')
  const [downloadName, setDownloadName] = useState('')

  function chooseFile(next: File | undefined) {
    if (!next) return
    if (next.type !== 'application/pdf' && !next.name.toLowerCase().endsWith('.pdf')) {
      setError('Please choose a PDF file.')
      setStatus('error')
      return
    }
    if (next.size > MAX_SIZE) {
      setError('That file is larger than 25 MB. Please choose a smaller PDF.')
      setStatus('error')
      return
    }
    setFile(next)
    setError('')
    setStatus('ready')
  }

  async function convert() {
    if (!file) return
    setStatus('converting')
    setError('')
    const body = new FormData()
    body.append('file', file)
    try {
      const response = await fetch('/api/convert', { method: 'POST', body })
      if (!response.ok) throw new Error((await response.json().catch(() => null))?.detail ?? 'Conversion failed. Please try again.')
      const blob = await response.blob()
      const disposition = response.headers.get('content-disposition') ?? ''
      const match = disposition.match(/filename="?([^";]+)"?/)
      const name = match?.[1] ?? `${file.name.replace(/\.pdf$/i, '')}.xlsx`
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      setDownloadName(name)
      setStatus('complete')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Conversion failed. Please try again.')
      setStatus('error')
    }
  }

  function download() {
    if (!downloadUrl) return
    const anchor = document.createElement('a')
    anchor.href = downloadUrl
    anchor.download = downloadName
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  }

  function reset() {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl)
    setFile(null); setDownloadUrl(''); setDownloadName(''); setError(''); setStatus('idle')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7 lg:px-10">
        <div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><FileSpreadsheet data-icon="inline-start" /></div><span className="font-mono text-sm font-bold tracking-tight">SHAHZAIB PDF TO EXCEL</span></div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole data-icon="inline-start" /> Files stay private</div>
      </header>
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-10 lg:px-10 lg:pt-20">
        <div className="max-w-3xl"><p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-primary">PDF → Excel converter</p><h1 className="max-w-3xl text-balance font-sans text-5xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-7xl">Turn messy PDFs into <span className="text-primary">clean spreadsheets.</span></h1><p className="mt-7 max-w-xl text-pretty text-lg leading-7 text-muted-foreground">Extract tables and text from your PDF into a ready-to-edit Excel workbook. No account, no complicated settings.</p></div>
        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_310px]">
          <div className="rounded-[2rem] border border-border bg-card p-3 shadow-sm">
            <div className={`relative flex min-h-[360px] flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed px-6 text-center transition-colors ${status === 'error' ? 'border-destructive/50 bg-destructive/5' : 'border-primary/35 bg-primary/[0.035]'}`} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); chooseFile(e.dataTransfer.files[0]) }}>
              <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(e) => chooseFile(e.target.files?.[0])} />
              {status === 'complete' ? <><div className="mb-6 grid size-16 place-items-center rounded-2xl bg-primary text-primary-foreground"><Check data-icon="inline-start" /></div><h2 className="text-2xl font-semibold tracking-tight">Your Excel file is ready.</h2><p className="mt-2 max-w-sm truncate text-sm text-muted-foreground">{downloadName}</p><button onClick={download} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"><Download data-icon="inline-start" /> Download Excel</button><button onClick={reset} className="mt-4 text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground">Convert another PDF</button></> : status === 'converting' ? <><div className="mb-6 grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary"><RefreshCw className="animate-spin" data-icon="inline-start" /></div><h2 className="text-2xl font-semibold tracking-tight">Reading your PDF…</h2><p className="mt-2 text-sm text-muted-foreground">Finding tables and building your workbook</p><div className="mt-8 h-1.5 w-56 overflow-hidden rounded-full bg-muted"><div className="h-full w-2/3 animate-pulse rounded-full bg-primary" /></div></> : file ? <><div className="mb-5 grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary"><FileText data-icon="inline-start" /></div><h2 className="max-w-md truncate text-2xl font-semibold tracking-tight">{file.name}</h2><p className="mt-2 text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB · PDF</p><button onClick={convert} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:-translate-y-0.5"><FileSpreadsheet data-icon="inline-start" /> Convert to Excel</button><button onClick={reset} className="mt-4 block w-full text-sm text-muted-foreground underline underline-offset-4">Remove file</button></> : <><div className="mb-6 grid size-16 place-items-center rounded-2xl bg-primary text-primary-foreground"><Upload data-icon="inline-start" /></div><h2 className="text-2xl font-semibold tracking-tight">Drop your PDF here</h2><p className="mt-2 text-sm text-muted-foreground">or choose a file from your computer</p><button onClick={() => inputRef.current?.click()} className="mt-8 rounded-xl border border-border bg-background px-5 py-3 font-semibold hover:bg-muted">Browse files</button><p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">PDF only · 25 MB max</p></>}
              {status === 'error' && <div className="absolute bottom-5 flex items-center gap-2 text-sm text-destructive"><X data-icon="inline-start" /> {error}</div>}
            </div>
          </div>
          <aside className="flex flex-col gap-4 lg:pt-4"><div className="rounded-2xl border border-border bg-card p-6"><ShieldCheck className="mb-5 text-primary" /><h3 className="font-semibold">Private by design</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Your file is processed for conversion and never used for training or shared with anyone.</p></div><div className="rounded-2xl bg-primary p-6 text-primary-foreground"><p className="font-mono text-[11px] uppercase tracking-wider opacity-70">How it works</p><ol className="mt-5 flex flex-col gap-4 text-sm"><li className="flex gap-3"><span className="font-mono opacity-60">01</span> Upload a PDF</li><li className="flex gap-3"><span className="font-mono opacity-60">02</span> We extract the data</li><li className="flex gap-3"><span className="font-mono opacity-60">03</span> Download your .xlsx</li></ol></div></aside>
        </div>
      </section>
      <footer className="border-t border-border px-6 py-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Shahzaib86Dev. Built for simpler document workflows.</p>
          <p className="font-mono text-xs uppercase tracking-[0.16em]">Shahzaib PDF to Excel</p>
        </div>
      </footer>
    </main>
  )
}
