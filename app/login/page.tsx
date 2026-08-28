'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { ArrowLeft, FileSpreadsheet, LockKeyhole } from 'lucide-react'

export default function LoginPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7 lg:px-10">
        <Link href="/" className="flex items-center gap-3" aria-label="Back to Shahzaib PDF to Excel">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <FileSpreadsheet data-icon="inline-start" />
          </span>
          <span className="font-mono text-sm font-bold tracking-tight">SHAHZAIB PDF TO EXCEL</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <LockKeyhole data-icon="inline-start" /> Secure access
        </div>
      </header>

      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-[2rem] border border-border bg-card p-8 shadow-sm sm:p-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft data-icon="inline-start" /> Back to converter
          </Link>
          <div className="mt-10">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-primary">Welcome back</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em]">Log in to your account.</h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">Access your PDF conversion workspace and recent files.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="email">
              Email address
              <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className="h-12 rounded-xl border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="password">
              Password
              <input id="password" name="password" type="password" required autoComplete="current-password" placeholder="Enter your password" className="h-12 rounded-xl border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </label>
            <button type="submit" className="h-12 rounded-xl bg-primary px-5 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/30">Log in</button>
            {submitted && <p className="text-center text-sm text-muted-foreground" role="status">Login is ready to connect when authentication is enabled.</p>}
          </form>

          <div className="my-7 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" /></div>
          <button type="button" className="h-12 w-full rounded-xl border border-border bg-background px-5 font-semibold transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/30">Continue with Google</button>
          <p className="mt-8 text-center text-sm text-muted-foreground">Don&apos;t have an account? <Link href="/login" className="font-semibold text-primary hover:underline">Create one</Link></p>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-6 lg:px-10"><p className="mx-auto max-w-6xl text-center text-sm text-muted-foreground">© 2026 Shahzaib86Dev. Built for simpler document workflows.</p></footer>
    </main>
  )
}

