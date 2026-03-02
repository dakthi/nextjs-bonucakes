import { Metadata } from 'next'
import SessionProvider from '@/components/SessionProvider'

export const metadata: Metadata = {
  title: 'Admin - Bonu Cakes',
  description: 'Admin dashboard for managing Bonu Cakes products, orders, and content',
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SessionProvider>{children}</SessionProvider>
}
