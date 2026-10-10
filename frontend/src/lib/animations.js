export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
}

export const fadeInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
}

export const fadeInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export const slideInFromBottom = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: '100%', opacity: 0 },
}

export const slideInFromRight = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 },
}

export const pageTransition = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}

export const smoothTransition = {
  duration: 0.3,
  ease: [0.25, 0.1, 0.25, 1],
}

export const appleEase = {
  duration: 0.5,
  ease: [0.25, 0.1, 0.25, 1],
}

export const bounceTransition = {
  type: 'spring',
  stiffness: 400,
  damping: 25,
}

export const cardHover = {
  scale: 1.02,
  y: -4,
  transition: smoothTransition,
}

export const buttonTap = {
  scale: 0.98,
}

export const imageHover = {
  scale: 1.05,
  transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
}
