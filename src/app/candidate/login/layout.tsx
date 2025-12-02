import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Candidate Login | Red-Flagged Account Access',
  description:
    'Candidate login for Red-Flagged. Approved candidates can sign in to manage their profile and monitor how employers view their verified history.',
}

export default function CandidateLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


