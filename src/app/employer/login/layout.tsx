import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Employer Login | Red-Flagged Dashboard Access',
  description:
    'Secure employer login for Red-Flagged. Sign in to add candidates, verify histories, and track offer dropouts from your employer dashboard.',
}

export default function EmployerLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


