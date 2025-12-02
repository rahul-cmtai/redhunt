import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Red-Flagged Support & Sales',
  description:
    'Contact the Red-Flagged team for product demos, pricing, onboarding assistance, or technical support. We typically respond in under 12 hours.',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


