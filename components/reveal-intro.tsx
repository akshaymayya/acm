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

const VAULT_MEMBER_PHOTO = "/member.png";
const GATEKEEPER_PRESIDENT_PHOTO = "/president.png";
const GATEKEEPER_BG_AUDIO = "/gatekeeper-audio.mp3.mpeg";
const GATEKEEPER_BRIBE_REACTION_PHOTO = "/vimal.jpg";

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
    { text: "Tradition, Prestige, Discipline... These are the three pillars of this Gurukul. These are the ideals upon which we build your tomorrow.", options: null },
    { text: "Hmm... Scanning database for selected ACM 2026-27 candidates...", options: null },
    { text: "WAIT! Let me check the USN database... Running GigaChad credentials script...", options: null },
    {
      text: "ACCESS GRANTED, OH MY GODDD, NICE EYES THOUGH! Welcome to ACM 2026-27! 🐐👑",
      options: [
        { label: "ENTER THE REALM", action: 'enter' },
        { label: "Try to Bribe with Vimal Masala", action: 'bribe' }
      ]
    }
  ]

  // Typewriter effect
  useEffect(() => {
    if (state !== 'gatekeeper') return
    const currentText = activeBribe ? "bolo ACM kesari" : dialogue[dialogIndex].text
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
  }, [state, dialogIndex, activeBribe])

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
      {/* Gatekeeper Background Audio */}
      {state === 'gatekeeper' && !activeBribe && (
        <audio src={GATEKEEPER_BG_AUDIO} autoPlay loop muted={muted} className="hidden" />
      )}

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
              <div className="absolute inset-2 rounded-full border border-accent flex items-center justify-center overflow-hidden animate-pulse bg-zinc-900">
                {/* Fallback silhouette if image fails */}
                <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 text-zinc-500 fill-current">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                {/* Photo Placeholder */}
                <img 
                  src={VAULT_MEMBER_PHOTO} 
                  alt="Member" 
                  className="absolute inset-0 w-full h-full object-cover z-10"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
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
                    className="absolute border border-primary/40 rounded-full w-[100px] h-[100px]"
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
            {/* Gatekeeper Character Photo Slot */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className={
                activeBribe 
                  ? "w-64 h-64 md:w-80 md:h-80 bg-zinc-900 border-2 border-[#ffbe0b] rounded-lg mb-8 flex items-center justify-center relative shadow-[0_0_30px_rgba(255,190,11,0.3)] overflow-hidden"
                  : "w-36 h-36 bg-zinc-900 border-2 border-accent rounded-full mb-8 flex items-center justify-center relative shadow-[0_0_20px_rgba(0,217,255,0.2)] overflow-hidden"
              }
            >
              {/* Fallback silhouette */}
              <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-16 h-16 text-zinc-500 fill-current">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <img 
                src={activeBribe ? GATEKEEPER_BRIBE_REACTION_PHOTO : GATEKEEPER_PRESIDENT_PHOTO}
                alt={activeBribe ? "Bribe Reaction" : "President"}
                className="absolute inset-0 w-full h-full object-cover z-10"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
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
                  {activeBribe ? "Continue" : (dialogIndex === dialogue.length - 1 ? "ENTER THE GATEWAY" : "CONTINUE")}
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
