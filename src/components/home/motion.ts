import type { Variants } from 'framer-motion';

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// Small offsets + short durations keep scroll reveals feeling smooth rather than heavy.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const revealOnce = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-80px' },
} as const;
