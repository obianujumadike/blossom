import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Patient Cases - Bossom',
  description: 'Manage mammogram analysis cases and patient records',
}

export default function CasesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}