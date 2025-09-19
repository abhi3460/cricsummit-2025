/**
 * Variation Bowling Outcome Rules
 * Rules for Slower Ball, Leg Cutter, and Off Cutter bowling types
 */

import { OutcomeRule } from '../../types';

export const VARIATION_BOWLING_RULES: OutcomeRule[] = [
  // Slower Ball combinations
  {
    bowlingType: 'Slower Ball',
    shotType: 'SquareCut',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '3 runs',
      Perfect: '4 runs',
      Late: '2 runs',
    },
  },
  {
    bowlingType: 'Slower Ball',
    shotType: 'CoverDrive',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Slower Ball',
    shotType: 'Long On',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Slower Ball',
    shotType: 'Straight',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '3 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Slower Ball',
    shotType: 'Pull',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Slower Ball',
    shotType: 'Sweep',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },

  // Leg Cutter combinations
  {
    bowlingType: 'Leg Cutter',
    shotType: 'LegGlance',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '3 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Leg Cutter',
    shotType: 'Flick',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '3 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Leg Cutter',
    shotType: 'Straight',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '3 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Leg Cutter',
    shotType: 'SquareCut',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '2 runs',
    },
  },
  {
    bowlingType: 'Leg Cutter',
    shotType: 'CoverDrive',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },

  // Off Cutter combinations
  {
    bowlingType: 'Off Cutter',
    shotType: 'Long On',
    timingOutcomes: {
      Early: '1 run',
      Good: '3 runs',
      Perfect: '6 runs',
      Late: '2 runs',
    },
  },
  {
    bowlingType: 'Off Cutter',
    shotType: 'SquareCut',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '3 runs',
      Perfect: '4 runs',
      Late: '2 runs',
    },
  },
  {
    bowlingType: 'Off Cutter',
    shotType: 'CoverDrive',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Off Cutter',
    shotType: 'Straight',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '3 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Off Cutter',
    shotType: 'Pull',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Off Cutter',
    shotType: 'Sweep',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Off Cutter',
    shotType: 'Scoop',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '3 runs',
      Perfect: '6 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Off Cutter',
    shotType: 'LegGlance',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '3 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Off Cutter',
    shotType: 'UpperCut',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
];
