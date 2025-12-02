import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.red-flagged.com'),
  title: 'Red-Flagged - Verify Before You Hire',
  description: 'Red-Flagged is a B2B verification platform that lets employers track candidates who accept offers but fail to join — helping companies hire smarter and avoid repeated no-shows.',
  keywords: 'hiring, recruitment, candidate verification, B2B, HR, employment, background check',
  authors: [{ name: 'Red-Flagged Technologies' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Red-Flagged - Verify Before You Hire',
    description: 'Discover how many job offers a candidate accepted but never joined. Build hiring trust with verified employer data.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Red-Flagged - Verify Before You Hire',
    description: 'Discover how many job offers a candidate accepted but never joined. Build hiring trust with verified employer data.',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Google Analytics (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9S8DWG2J9E"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9S8DWG2J9E');
          `}
        </Script>
        {children}
      </body>
    </html>
  )
}