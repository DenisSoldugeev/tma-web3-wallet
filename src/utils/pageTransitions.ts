/**
 * Framer Motion page transition variants
 *
 * Smooth page transitions using Framer Motion
 * Supports forward and backward navigation with slide animations
 */

import type { Variants } from 'framer-motion';
import type { Transition } from 'motion-dom';

export type TransitionDirection = 'forward' | 'backward';

/**
 * Transition configuration
 */
const TRANSITION_CONFIG: Transition = {
  duration: 0.25,
  ease: [0.16, 1, 0.3, 1], // ease-out-expo
};

/**
 * Slide distance as percentage
 */
const SLIDE_DISTANCE = '30%';

/**
 * Page animation variants for forward navigation
 * Current page slides left, new page slides in from right
 */
export const forwardVariants: Variants = {
  initial: {
    x: SLIDE_DISTANCE,
    scale: 1.05,
    opacity: 0,
  },
  animate: {
    x: 0,
    scale: 1,
    opacity: 1,
    transition: TRANSITION_CONFIG,
  },
  exit: {
    x: `-${SLIDE_DISTANCE}`,
    scale: 0.95,
    opacity: 0,
    transition: TRANSITION_CONFIG,
  },
};

/**
 * Page animation variants for backward navigation
 * Current page slides right, previous page slides in from left
 */
export const backwardVariants: Variants = {
  initial: {
    x: `-${SLIDE_DISTANCE}`,
    scale: 0.95,
    opacity: 0,
  },
  animate: {
    x: 0,
    scale: 1,
    opacity: 1,
    transition: TRANSITION_CONFIG,
  },
  exit: {
    x: SLIDE_DISTANCE,
    scale: 1.05,
    opacity: 0,
    transition: TRANSITION_CONFIG,
  },
};

/**
 * Default fade transition (no direction)
 */
export const fadeVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: TRANSITION_CONFIG,
  },
  exit: {
    opacity: 0,
    transition: TRANSITION_CONFIG,
  },
};

/**
 * Get animation variants based on transition direction
 *
 * @param direction - Transition direction ('forward', 'backward', or undefined for fade)
 * @returns Framer Motion variants object
 */
export function getPageVariants(direction?: TransitionDirection): Variants {
  if (direction === 'forward') return forwardVariants;
  if (direction === 'backward') return backwardVariants;
  return fadeVariants;
}
