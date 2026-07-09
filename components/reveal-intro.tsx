'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, Zap, Cpu, Key, Lock, Unlock, Volume2, VolumeX, ArrowDown } from 'lucide-react'

interface RevealIntroProps {
  onComplete: () => void
  onScrollUnlock?: (unlocked: boolean) => void
}

type RevealState = 'vault' | 'scanning' | 'video' | 'gatekeeper' | 'opening'

// Web Audio API Synthesizer Helper
class SoundEffects {
  ctx: AudioContext | null = null

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  playScan() {
    this.init()
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(150, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 1.5)
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.5)
    
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 1.5)
  }

  playWhoosh() {
    this.init()
    if (!this.ctx) return
    const bufferSize = this.ctx.sampleRate * 2
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(100, this.ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(3000, this.ctx.currentTime + 2)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 2.2)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    noise.start()
    noise.stop(this.ctx.currentTime + 2.2)
  }

  playSuccess() {
    this.init()
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const notes = [261.63, 329.63, 392.00, 523.25] // C4, E4, G4, C5
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + idx * 0.15)
      
      gain.gain.setValueAtTime(0.1, now + idx * 0.15)
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.15 + 0.4)
      
      osc.connect(gain)
      gain.connect(this.ctx!.destination)
      
      osc.start(now + idx * 0.15)
      osc.stop(now + idx * 0.15 + 0.4)
    })
  }
}

const sfx = new SoundEffects()

export function RevealIntro({ onComplete, onScrollUnlock }: RevealIntroProps) {
  const [state, setState] = useState<RevealState>('vault')
  const [muted, setMuted] = useState(false)
  const [videoPlayFailed, setVideoPlayFailed] = useState(false)
  const [scrollUnlocked, setScrollUnlocked] = useState(false)
  const [showScrollPrompt, setShowScrollPrompt] = useState(false)
  const [dialogIndex, setDialogIndex] = useState(0)
  const [typewriterText, setTypewriterText] = useState('')
  const [activeBribe, setActiveBribe] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null)

  // Dialogue sequence for the Gatekeeper
  const dialogue = [
    { text: "HALT! Who goes there?! State your business at the ACM Core Vault.", options: null },
    { text: "Hmm... Scanning database for selected ACM 2026-27 candidates...", options: null },
    { text: "WAIT! Let me check the USN database... Running GigaChad credentials script...", options: null },
    {
      text: "ACCESS GRANTED, OH MY GODDD, NICE EYES THOUGH! Welcome to ACM 2026-27! 🐐👑",
      options: [
        { label: "ENTER THE REALM", action: 'enter' },
        { label: "Try to Bribe with Starbucks Coupon ☕", action: 'bribe' },
        { label: "Hacker Bypass 💻", action: 'hack' }
      ]
    }
  ]

  // Typewriter effect
  useEffect(() => {
    if (state !== 'gatekeeper') return
    const currentText = dialogue[dialogIndex].text
    let i = 0
    setTypewriterText('')
    
    const interval = setInterval(() => {
      if (i < currentText.length) {
        setTypewriterText(currentText.substring(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [state, dialogIndex])

  // Lock scroll initially
  useEffect(() => {
    if (!scrollUnlocked) {
      document.body.style.overflow = 'hidden'
      document.body.style.maxHeight = '100vh'
    } else {
      document.body.style.overflow = ''
      document.body.style.maxHeight = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.maxHeight = ''
    }
  }, [scrollUnlocked])

  useEffect(() => {
    onScrollUnlock?.(scrollUnlocked)
  }, [scrollUnlocked, onScrollUnlock])

  // Listen to scrolling to skip/proceed after unlock (removed to enforce gatekeeper workflow)

  // Start video and audio playback
  const startReveal = () => {
    sfx.playScan()
    setState('scanning')
    
    setTimeout(() => {
      setState('video')
      sfx.playWhoosh()

      // Attempt to play custom video and audio
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          setVideoPlayFailed(true)
        })
      }
      if (audioRef.current && !muted) {
        audioRef.current.play().catch(() => {
          // Fail silently
        })
      }

      // Scroll remains locked until candidate successfully enters

      // Automatically transition to gatekeeper after 8 seconds (or when video ends)
      setTimeout(() => {
        setState((current) => (current === 'video' ? 'gatekeeper' : current))
      }, 9000)
    }, 1800)
  }

  const handleVideoEnded = () => {
    if (state === 'video') {
      setState('gatekeeper')
    }
  }

  const handleDialogNext = () => {
    if (dialogIndex < dialogue.length - 1) {
      setDialogIndex(dialogIndex + 1)
    }
  }

  const proceedToOpening = () => {
    setState('opening')
    setScrollUnlocked(true)
    sfx.playSuccess()
    triggerConfetti()
    setTimeout(() => {
      onComplete()
    }, 2500)
  }

  // Comedic Option Handler
  const handleOptionClick = (action: string) => {
    if (action === 'enter') {
      proceedToOpening()
    } else if (action === 'bribe') {
      setActiveBribe(true)
      setTypewriterText("A Pumpkin Spice Latte coupon?! *Gasp* Access is double-granted! Enter, you rich legend! 🚀")
    } else if (action === 'hack') {
      setTypewriterText("ADMIN ACCESS DETECTED: Bypass successful. Enjoy your god mode! 👾")
      setTimeout(() => {
        proceedToOpening()
      }, 1500)
    }
  }

  // Simple Confetti Emitter
  const triggerConfetti = () => {
    const canvas = confettiCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ['#ff006e', '#00d9ff', '#ffbe0b', '#3a86c8', '#8338ec']
    const particles = Array.from({ length: 150 }).map(() => ({
      x: canvas.width / 2,
      y: canvas.height + 20,
      vx: (Math.random() - 0.5) * 20,
      vy: -Math.random() * 20 - 10,
      radius: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.015 + 0.005
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let active = false
      particles.forEach((p) => {
        if (p.alpha > 0) {
          active = true
          p.x += p.vx
          p.y += p.vy
          p.vy += 0.5 // gravity
          p.alpha -= p.decay
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.globalAlpha = p.alpha
          ctx.fill()
        }
      })
      if (active) {
        requestAnimationFrame(animate)
      }
    }
    animate()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#050505] flex items-center justify-center font-mono select-none text-white">
      <canvas ref={confettiCanvasRef} className="absolute inset-0 pointer-events-none z-40" />

      {/* Audio & Video Elements */}
      <video
        ref={videoRef}
        src="/reveal-video.mp4"
        className="hidden"
        onEnded={handleVideoEnded}
        playsInline
      />
      <audio ref={audioRef} src="/reveal-audio.mp3" className="hidden" />

      {/* Mute Control */}
      <button
        onClick={() => setMuted(!muted)}
        className="absolute top-4 right-4 z-50 p-3 bg-zinc-900 border border-zinc-800 rounded-full hover:border-accent text-zinc-400 hover:text-white transition duration-200"
      >
        {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      <AnimatePresence mode="wait">
        {/* State: Vault (Idle Screen) */}
        {state === 'vault' && (
          <motion.div
            key="vault"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center px-6 max-w-lg z-10 flex flex-col items-center animate-fade-in"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-32 h-32 rounded-full border-4 border-dashed border-primary flex items-center justify-center mb-8 relative"
            >
              <div className="absolute inset-2 rounded-full border border-accent opacity-50 flex items-center justify-center">
                <Lock className="w-12 h-12 text-accent animate-pulse" />
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold text-white tracking-widest uppercase mb-2">
              ACM Core Portal
            </h1>
            <p className="text-sm text-zinc-500 max-w-sm mb-8 leading-relaxed">
              Biometric authorization required. Attempting unauthorized access triggers absolute chaos.
            </p>

            <button
              onClick={startReveal}
              className="group relative px-8 py-4 bg-primary text-black font-extrabold rounded-lg overflow-hidden shadow-2xl transition hover:scale-105 active:scale-95 duration-200"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-3 text-lg">
                <Cpu className="w-5 h-5 animate-pulse" /> SCAN FINGERPRINT
              </span>
            </button>
          </motion.div>
        )}

        {/* State: Scanning */}
        {state === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center z-10"
          >
            <div className="relative w-40 h-40 mx-auto mb-8 flex items-center justify-center border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
              <motion.div
                initial={{ y: '-100%' }}
                animate={{ y: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-0 right-0 h-1 bg-accent shadow-[0_0_15px_#00d9ff]"
              />
              <Key className="w-16 h-16 text-zinc-700 animate-pulse" />
            </div>
            <p className="text-accent text-sm tracking-widest uppercase animate-pulse">
              ANALYZING GENETIC VIBES...
            </p>
          </motion.div>
        )}

        {/* State: Video Player or Fallback Portal Animation */}
        {state === 'video' && (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black"
          >
            {/* Fallback space tunnel using raw CSS/Framer motion if video fails or not uploaded */}
            {videoPlayFailed ? (
              <div className="absolute inset-0 overflow-hidden bg-zinc-950 flex items-center justify-center">
                <div className="absolute inset-0 opacity-20">
                  <div className="stars absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-transparent to-transparent bg-repeat" />
                </div>
                {/* Cyber-tunnel graphics */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute border border-primary/40 rounded-full"
                    style={{ width: 100, height: 100 }}
                    animate={{
                      scale: [1, 20],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: i * 0.6,
                      ease: 'easeIn',
                    }}
                  />
                ))}
                <div className="z-10 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ShieldAlert className="w-16 h-16 text-primary mx-auto mb-4" />
                  </motion.div>
                  <p className="text-white text-lg font-bold uppercase tracking-widest animate-pulse">
                    LOADING PORTAL SEQUENCE
                  </p>
                  <p className="text-zinc-500 text-xs mt-2 font-mono">
                    System Override: Bypassing standard protocol
                  </p>
                </div>
              </div>
            ) : (
              <video
                ref={videoRef}
                src="/reveal-video.mp4"
                className="w-full h-full object-cover"
                onEnded={handleVideoEnded}
                playsInline
              />
            )}

            {/* Scroll Indicator Prompt (removed) */}

            {/* Skip Button */}
            <button
              onClick={() => setState('gatekeeper')}
              className="absolute bottom-6 right-6 px-4 py-2 border border-zinc-700 bg-zinc-950/80 backdrop-blur text-xs text-zinc-400 hover:text-white rounded transition hover:border-zinc-500 animate-pulse"
            >
              Skip Intro
            </button>
          </motion.div>
        )}

        {/* State: Gatekeeper Greeting Dialog */}
        {state === 'gatekeeper' && (
          <motion.div
            key="gatekeeper"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-xl w-full px-6 flex flex-col items-center text-center z-10"
          >
            {/* Gatekeeper Character SVG Avatar */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="w-36 h-36 bg-zinc-900 border-2 border-accent rounded-full mb-8 flex items-center justify-center p-4 relative group shadow-[0_0_20px_rgba(0,217,255,0.2)]"
            >
              {/* Glowing antenna */}
              <div className="absolute -top-3 w-1.5 h-6 bg-accent rounded-full animate-pulse">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-primary rounded-full animate-ping" />
              </div>
              
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-accent fill-none stroke-current stroke-2"
              >
                <rect x="25" y="30" width="50" height="40" rx="10" />
                <path d="M30 70 L20 85 M70 70 L80 85" strokeWidth="3" strokeLinecap="round" />
                <circle cx="40" cy="48" r="5" className="fill-accent animate-ping" />
                <circle cx="40" cy="48" r="3" className="fill-accent" />
                <circle cx="60" cy="48" r="5" className="fill-accent animate-ping" />
                <circle cx="60" cy="48" r="3" className="fill-accent" />
                <path d="M42 60 Q50 64 58 60" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </motion.div>

            {/* Dialogue Bubble */}
            <div className="relative w-full border border-zinc-800 bg-zinc-950 p-6 rounded-xl shadow-2xl mb-8">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-zinc-950" />
              <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 border-8 border-transparent border-b-zinc-800 -z-10" />
              
              <p className="text-zinc-200 text-sm leading-relaxed text-left min-h-[4.5rem]">
                {typewriterText}
              </p>
            </div>

            {/* Progression & Choices */}
            <div className="w-full flex flex-col gap-3">
              {dialogue[dialogIndex].options && !activeBribe ? (
                dialogue[dialogIndex].options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleOptionClick(opt.action)}
                    className="w-full py-3 bg-zinc-900 border border-zinc-800 hover:border-accent hover:bg-zinc-800/50 rounded-lg text-sm text-zinc-300 hover:text-white transition duration-200 flex items-center justify-center gap-2"
                  >
                    {opt.label === "ENTER THE REALM" && <Zap className="w-4 h-4 text-accent" />}
                    {opt.label}
                  </button>
                ))
              ) : (
                <button
                  onClick={
                    dialogIndex === dialogue.length - 1 || activeBribe
                      ? proceedToOpening
                      : handleDialogNext
                  }
                  className="w-full py-3 bg-accent text-black font-extrabold rounded-lg hover:bg-white transition duration-200"
                >
                  {dialogIndex === dialogue.length - 1 || activeBribe ? "ENTER THE GATEWAY" : "CONTINUE"}
                </button>
              )}
            </div>

            {/* Bypass Scroll Prompt (removed) */}
          </motion.div>
        )}

        {/* State: Opening (Framer Motion Vault Sliding Open) */}
        {state === 'opening' && (
          <motion.div
            key="opening"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex overflow-hidden pointer-events-none"
          >
            {/* Left door sliding out */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: '-100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="w-1/2 h-full bg-zinc-950 border-r border-zinc-800 shadow-[10px_0_30px_rgba(0,0,0,0.8)] flex items-center justify-end pr-8"
            >
              <div className="flex flex-col items-center opacity-30">
                <Unlock className="w-20 h-20 text-accent mb-2" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">ACM LEFT_DOOR</span>
              </div>
            </motion.div>

            {/* Right door sliding out */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="w-1/2 h-full bg-zinc-950 border-l border-zinc-800 shadow-[-10px_0_30px_rgba(0,0,0,0.8)] flex items-center justify-start pl-8"
            >
              <div className="flex flex-col items-center opacity-30">
                <Unlock className="w-20 h-20 text-accent mb-2" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">ACM RIGHT_DOOR</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
