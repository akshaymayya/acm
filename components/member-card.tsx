'use client'

import { motion } from 'framer-motion'

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
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300" />

      <div className="relative border border-border bg-card rounded-lg p-4 backdrop-blur-sm hover:border-accent transition-colors duration-300">
        <div className="absolute top-0 right-0 w-1 h-8 bg-accent opacity-0 group-hover:opacity-100 rounded-l" />

        <h3 className="text-base font-bold text-foreground">{name}</h3>
        <p className="text-xs text-accent mt-2">{usn}</p>
      </div>
    </motion.div>
  )
}
