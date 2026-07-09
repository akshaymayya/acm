'use client'

import { useRouter } from 'next/navigation'
import { RevealIntro } from '@/components/reveal-intro'

export default function Page() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <RevealIntro 
        onComplete={() => {
          router.push('/batman')
        }} 
      />
    </main>
  )
}
