import type { Metadata } from 'next'
import { Cinzel, Raleway } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '600', '700', '900'],
  display: 'swap',
})

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TimeTravel Agency — Luxury Time Travel Experiences',
  description: "Experience history's finest moments with the world's premier luxury time travel agency. Book your temporal journey today.",
  keywords: ['time travel', 'luxury travel', 'Paris 1889', 'Florence Renaissance', 'Cretaceous Period'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${raleway.variable} scroll-smooth`}>
      <body className="bg-black text-white font-body antialiased">
        {children}
      </body>
    </html>
  )
}
