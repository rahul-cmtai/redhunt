import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Candidate Sign Up | Create Your Red-Flagged Account',
  description:
    'Register as a candidate on Red-Flagged to build a trusted profile, manage your verified history, and improve your chances with transparent employers.',
}

export default function CandidateRegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


