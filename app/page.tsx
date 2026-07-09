'use client'

import { useState, useEffect } from 'react'
import { Hero } from '@/components/hero'
import { TeamSection } from '@/components/team-section'
import { Footer } from '@/components/footer'
import { RevealIntro } from '@/components/reveal-intro'

export default function Page() {
  const [revealComplete, setRevealComplete] = useState(false)
  const [scrollUnlocked, setScrollUnlocked] = useState(false)

  // Support replaying the reveal effect via custom event
  useEffect(() => {
    const handleReplay = () => {
      setRevealComplete(false)
      setScrollUnlocked(false)
    }
    window.addEventListener('replay-reveal', handleReplay)
    return () => window.removeEventListener('replay-reveal', handleReplay)
  }, [])

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {!revealComplete && (
        <RevealIntro 
          onComplete={() => {
            setRevealComplete(true)
            setScrollUnlocked(true)
          }} 
          onScrollUnlock={(unlocked) => setScrollUnlocked(unlocked)}
        />
      )}
      
      {/* 
        If scroll is not unlocked, we lock height to 100vh and hide content to disable scrolling.
        Once unlocked, we show contents, letting the user scroll down.
        Upon full reveal completion, we fade in fully and enable interaction.
      */}
      <div 
        className={
          !scrollUnlocked 
            ? 'h-screen overflow-hidden opacity-0 pointer-events-none' 
            : revealComplete 
              ? 'opacity-100 transition-opacity duration-1000' 
              : 'opacity-50 blur-sm pointer-events-none'
        }
      >
        <Hero />
        <TeamSection />
        <Footer />
      </div>
    </main>
  )
}
