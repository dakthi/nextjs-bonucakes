import { Metadata } from 'next'
import SessionProvider from '@/components/SessionProvider'

export const metadata: Metadata = {
  title: 'Admin - Bonucakes',
  description: 'Admin dashboard for managing Bonucakes products, orders, and content',
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SessionProvider>{children}</SessionProvider>
}
