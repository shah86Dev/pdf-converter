import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'Shahzaib PDF to Excel', description: 'Convert PDF tables into clean Excel spreadsheets.' }
export const viewport: Viewport = { colorScheme: 'light', themeColor: '#f5f6f2' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="bg-background"><body>{children}</body></html>
}
