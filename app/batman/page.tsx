'use client'

import { useRouter } from 'next/navigation'
import { BatmanTribute } from '@/components/batman-tribute'

export default function BatmanPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-background overflow-x-hidden flex items-center justify-center animate-fade-in">
      <BatmanTribute onComplete={() => {
        router.push('/portal')
      }} />
    </main>
  )
}
