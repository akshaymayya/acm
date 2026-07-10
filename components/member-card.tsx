'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

interface MemberCardProps {
  name: string
  usn: string
  index: number
}

export function MemberCard({
  name,
  usn,
  index,
}: MemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: false, margin: '-50px' }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative group cursor-pointer h-full"
    >
      {/* Glow effect behind the card */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-primary via-transparent to-accent opacity-0 group-hover:opacity-20 blur-xl rounded-xl transition duration-500" />

      {/* Card Body */}
      <div className="relative h-full flex flex-col justify-between border border-zinc-800/60 bg-zinc-900/40 rounded-xl p-6 md:p-8 backdrop-blur-md hover:bg-zinc-800/60 hover:border-accent/40 transition-all duration-500 overflow-hidden">
        
        {/* Animated corner accent line */}
        <div className="absolute top-0 right-0 w-2 h-16 bg-gradient-to-b from-primary to-accent opacity-0 group-hover:opacity-100 rounded-bl-2xl transition-all duration-500 translate-x-2 group-hover:translate-x-0" />
        
        <div className="pr-6">
          <h3 className="text-xl md:text-2xl font-extrabold text-zinc-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all duration-300 tracking-wide">
            {name}
          </h3>
          <p className="text-sm font-medium text-accent mt-3 uppercase tracking-widest leading-relaxed">
            {usn}
          </p>
        </div>

        {/* Hover Icon */}
        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-accent shadow-lg group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
