/**
 * Spin Bowling Outcome Rules
 * Rules for Off Break and Doosra bowling types
 */

import { OutcomeRule } from '../../types';

export const SPIN_BOWLING_RULES: OutcomeRule[] = [
  // Off Break combinations
  {
    bowlingType: 'Off Break',
    shotType: 'Sweep',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Off Break',
    shotType: 'UpperCut',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '3 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Off Break',
    shotType: 'Straight',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '3 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Off Break',
    shotType: 'LegGlance',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '3 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Off Break',
    shotType: 'CoverDrive',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Off Break',
    shotType: 'Pull',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },

  // Doosra combinations
  {
    bowlingType: 'Doosra',
    shotType: 'Scoop',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '4 runs',
      Perfect: '6 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Doosra',
    shotType: 'Sweep',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '3 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Doosra',
    shotType: 'LegGlance',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '3 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Doosra',
    shotType: 'Straight',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '3 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Doosra',
    shotType: 'CoverDrive',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Doosra',
    shotType: 'Flick',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '3 runs',
      Late: '1 wicket',
    },
  },
];
