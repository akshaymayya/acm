'use client'

import { Hero } from '@/components/hero'
import { TeamSection } from '@/components/team-section'
import { Footer } from '@/components/footer'

export default function PortalPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <div className="animate-fade-in">
        <Hero />
        <TeamSection />
        <Footer />
      </div>
    </main>
  )
}
