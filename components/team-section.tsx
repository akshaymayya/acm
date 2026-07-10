'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { MemberCard } from './member-card'

interface Section {
  title: string
  subsections?: {
    title: string
    members: { name: string; usn: string }[]
  }[]
  members?: { name: string; usn: string }[]
}

const sections: Section[] = [
  {
    title: 'Administration',
    subsections: [
      {
        title: 'Secretary',
        members: [
          { name: 'Hasnain Khan', usn: 'NNM24CS335 - Secretary' },
          { name: 'Sujanraj N', usn: 'NN25ISE236 - Joint Secretary' },
        ],
      },
      {
        title: 'Treasurer',
        members: [
          { name: 'Pranjal Shetty', usn: 'NNM24CB043 - Treasurer' },
          { name: 'Aryan Verma', usn: 'NNM24CS047 - Treasurer' },
        ],
      },
    ],
  },
  {
    title: 'Documentation',
    members: [
      { name: 'Swasthik M Prabhu', usn: 'NNM24CS265 - Head' },
      { name: 'Sathwik S L', usn: 'NNM24IS204 - Member' },
      { name: 'Sharanya L Shetty', usn: 'NN25CSE311 - Member' },
    ],
  },
  {
    title: 'Event Team',
    members: [
      { name: 'Trishal Hegde', usn: 'NNM24IS269 - Head' },
      { name: 'Shrinidhi Katti', usn: 'NNM24IS238 - Co Head' },
      { name: 'Ananya Shetty', usn: 'NN25ISE028 - Member' },
      { name: 'Vyshnavi R Nambiar', usn: 'NN25CSE429 - Member' },
    ],
  },
  {
    title: 'Tech Team',
    members: [
      { name: 'Yuvaraj Khot', usn: 'NNM24IS287 - Head' },
      { name: 'Vagish Kora', usn: 'NNM25CB506 - Co Head' },
      { name: 'Likith Alva', usn: 'NN25CSE176 - Member' },
      { name: 'Jithin Sathyendran', usn: 'NN25CSE151 - Member' },
    ],
  },
  {
    title: 'Graphics Team',
    members: [
      { name: 'Akshay S Mayya', usn: 'NNM24CS027 - Head' },
      { name: 'Vivian Derick Lobo', usn: 'NNM24IS285 - Member' },
      { name: 'Vaishakh Bangera', usn: 'NNM24IS270 - Member' },
    ],
  },
  {
    title: 'Media Team',
    members: [
      { name: 'Udhbhav S Nayak', usn: 'NNM24CS277 - Head' },
      { name: 'Shashanka Shanbhag', usn: 'NNM24IS214 - Member' },
      { name: 'Sampath S Kulkarni', usn: 'NN25ECE140 - Member' },
      { name: 'Shika Acharya', usn: 'NNM24IS219 - Member' },
    ],
  },
  {
    title: 'Social Media Team',
    members: [
      { name: 'K Divya Kamath', usn: 'NNM24CS329 - Head' },
      { name: 'Kruthika Upadhya', usn: 'NNM24EC077 - Member' },
    ],
  },
  {
    title: 'Publicity Team',
    members: [
      { name: 'Atharva Joshi', usn: 'NNM24CS056 - Member' },
      { name: 'Tarulata Priya', usn: 'NNM25BT901 - Member' },
      { name: 'Prisha Shetty', usn: 'NN25AIM090 - Member' },
      { name: 'Veeksha J', usn: 'NN25CSE413 - Member' },
    ],
  },
  {
    title: '3rd Year Representative',
    members: [
      { name: 'Vansh Shetty', usn: 'NNM24CS286' },
    ],
  },
  {
    title: '2nd Year Representative',
    members: [
      { name: 'Swasti Subramanya Hegde', usn: 'NN25CCE061' },
    ],
  },
]

export function TeamSection() {
  let memberIndex = 0
  const router = useRouter()

  return (
    <section id="team-section" className="relative py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Meet the <span className="text-primary">Legends</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A collection of absolute units ready to make 2026-27 unforgettable.
          </p>
        </motion.div>

        {/* Leadership Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24 flex flex-col items-center text-center space-y-12"
        >
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent opacity-20 blur-xl group-hover:opacity-40 transition duration-500 rounded-full" />
            <h3 className="relative text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-4 tracking-tight">
              Pratheeksha
            </h3>
            <p className="text-2xl text-zinc-400 uppercase tracking-[0.3em] font-medium">President <span className="text-sm opacity-50 block mt-2">NNM24CB504</span></p>
          </div>
          
          <div className="relative group mt-8">
            <div className="absolute -inset-4 bg-white/5 blur-lg group-hover:bg-white/10 transition duration-500 rounded-full" />
            <h4 className="relative text-4xl md:text-5xl font-bold text-white mb-3">
              Prakyath Yadav Suvarna
            </h4>
            <p className="text-xl text-zinc-500 uppercase tracking-widest">Vice President <span className="text-sm opacity-50 block mt-2">NNM24CS336</span></p>
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-24">
          {sections.map((section) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {/* Section header */}
              <div className="mb-10 flex flex-col items-center text-center">
                <h3 className="text-3xl font-bold text-white mb-4">
                  {section.title}
                </h3>
                <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded" />
              </div>

              {/* Render subsections if Administration, else render members */}
              {section.subsections ? (
                <div className="space-y-16">
                  {section.subsections.map((sub) => (
                    <div key={sub.title} className="bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800/50">
                      <h4 className="text-xl font-semibold text-accent mb-6 text-center uppercase tracking-widest">{sub.title}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {sub.members.map((member, idx) => (
                          <MemberCard
                            key={`${member.name}-${member.usn}-${idx}`}
                            name={member.name}
                            usn={member.usn}
                            index={memberIndex++}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.members?.map((member, idx) => (
                    <MemberCard
                      key={`${member.name}-${member.usn}-${idx}`}
                      name={member.name}
                      usn={member.usn}
                      index={memberIndex++}
                    />
                  ))}
                </div>
              )}
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
