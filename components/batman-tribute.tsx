'use client'

import { motion } from 'framer-motion'

const BATMAN_SECTION_PHOTO = "/batman.jpeg";

interface BatmanTributeProps {
  onComplete?: () => void;
}

export function BatmanTribute({ onComplete }: BatmanTributeProps) {
  return (
    <section className="relative w-full min-h-screen bg-[#050505] py-24 px-6 flex flex-col items-center justify-center font-mono z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl w-full flex flex-col items-center text-center gap-12"
      >
        {/* Image Slot */}
        <div className="w-64 h-64 border border-zinc-800 bg-zinc-900 rounded-lg overflow-hidden relative shadow-2xl">
          {/* Fallback silhouette */}
          <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
             <svg viewBox="0 0 24 24" className="w-20 h-20 text-zinc-500 fill-current">
               <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
             </svg>
          </div>
          <img 
            src={BATMAN_SECTION_PHOTO}
            alt="Batman Tribute"
            className="absolute inset-0 w-full h-full object-cover z-10"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-accent uppercase tracking-widest animate-pulse">
          Batman has an announcement for you
        </h2>

        {/* Dialogue Box */}
        <div className="relative w-full border border-zinc-800 bg-zinc-950 p-8 rounded-xl shadow-2xl text-left">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-zinc-950" />
          <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 border-8 border-transparent border-b-zinc-800 -z-10" />
          
          <div className="text-zinc-300 text-sm md:text-base leading-relaxed space-y-4">
            <p>
              &quot;They say the night is darkest before the dawn... and tonight, you all proved you&apos;re not afraid of the dark.
            </p>
            <p>
              Some of you earned roles, some of you didn&apos;t. But remember — it&apos;s not who you are underneath, it&apos;s what you do that defines you. Showing up, facing the questions, stepping into the unknown, and that already sets you apart.
            </p>
            <p>
              You stumbled? Good. You hesitated? Even better. That means you know where to grow stronger. Why do we fall? So we can learn to pick ourselves up.
            </p>
            <p>
              Remember, I wasn&apos;t forged in comfort. I was forged in fear, failure, and persistence. Gotham wasn&apos;t built in a day, and neither is a hero.
            </p>
            <p>
              This was only the beginning. Keep training. Keep pushing. The city — and your future — will need you ready. 🦇&quot;
            </p>
          </div>
        </div>
        
        {onComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="mt-8"
          >
            <button
              onClick={onComplete}
              className="px-8 py-3 bg-zinc-900 border border-zinc-800 hover:border-accent hover:bg-zinc-800/50 rounded-lg text-sm text-zinc-300 hover:text-white transition duration-200"
            >
              PROCEED TO PORTAL
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
