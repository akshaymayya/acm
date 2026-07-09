'use client'

import { motion } from 'framer-motion'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
        >
          <div>
            <h4 className="text-lg font-bold text-primary mb-4">ACM</h4>
            <p className="text-sm text-muted-foreground">
              Association for Computing Machinery
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-accent mb-4">2026-27</h4>
            <p className="text-sm text-muted-foreground">
              Core Team & Community Leaders
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-foreground mb-4">Meme Status</h4>
            <p className="text-sm text-muted-foreground">
              Vibes: Immaculate ✓
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-border text-center text-sm text-muted-foreground"
        >
          <p>
            Made with chaos and coffee. This site is a work in progress—characters
            and messages coming soon.
          </p>
          <p className="mt-2">© 2026-27 ACM Team • Peak Comedy Hours</p>
        </motion.div>
      </div>
    </footer>
  )
}
