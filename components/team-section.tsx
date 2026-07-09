'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { MemberCard } from './member-card'

interface Team {
  name: string
  members: Array<{
    name: string
    usn: string
  }>
}

const teams: Team[] = [
  {
    name: 'Leadership',
    members: [
      { name: 'Add Name', usn: 'Add USN' },
      { name: 'Add Name', usn: 'Add USN' },
    ],
  },
  {
    name: 'Tech Team',
    members: [
      { name: 'Add Name', usn: 'Add USN' },
      { name: 'Add Name', usn: 'Add USN' },
      { name: 'Add Name', usn: 'Add USN' },
    ],
  },
  {
    name: 'Event Team',
    members: [
      { name: 'Add Name', usn: 'Add USN' },
      { name: 'Add Name', usn: 'Add USN' },
    ],
  },
  {
    name: 'Design & Media',
    members: [
      { name: 'Add Name', usn: 'Add USN' },
      { name: 'Add Name', usn: 'Add USN' },
      { name: 'Add Name', usn: 'Add USN' },
    ],
  },
  {
    name: 'Operations',
    members: [
      { name: 'Add Name', usn: 'Add USN' },
      { name: 'Add Name', usn: 'Add USN' },
    ],
  },
]

export function TeamSection() {
  let memberIndex = 0
  const router = useRouter()

  return (
    <section className="relative py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Meet the <span className="text-primary">Legends</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A collection of absolute units ready to make 2026-27 unforgettable.
          </p>
        </motion.div>

        {/* Teams */}
        <div className="space-y-16">
          {teams.map((team) => (
            <motion.div
              key={team.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {/* Department header */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-accent mb-2">
                  {team.name}
                </h3>
                <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded" />
              </div>

              {/* Members grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.members.map((member, idx) => (
                  <MemberCard
                    key={`${member.name}-${member.usn}-${idx}`}
                    name={member.name}
                    usn={member.usn}
                    index={memberIndex++}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Replay Reveal Trigger */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 border border-dashed border-zinc-850 hover:border-accent bg-zinc-950/40 text-xs tracking-widest text-zinc-500 hover:text-accent rounded-full transition duration-300 uppercase cursor-pointer"
          >
            Replay Entrance Ritual 🔮
          </button>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 -left-32 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent opacity-5 rounded-full blur-3xl" />
    </section>
  )
}
