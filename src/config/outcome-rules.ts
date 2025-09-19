/**
 * Outcome Rules Configuration
 * Centralized configuration for cricket outcome prediction rules
 */

import { BowlingType, ShotType, ShotOutcome, OutcomeRule } from '../types';

export const OUTCOME_RULES: OutcomeRule[] = [
  // Bouncer ball combinations
  {
    bowlingType: 'Bouncer',
    shotType: 'Pull',
    timingOutcomes: {
      Early: '2 runs',
      Good: '4 runs',
      Perfect: '6 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Bouncer',
    shotType: 'UpperCut',
    timingOutcomes: {
      Early: '1 run',
      Good: '4 runs',
      Perfect: '6 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Bouncer',
    shotType: 'Straight',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Bouncer',
    shotType: 'Sweep',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },

  // Yorker combinations
  {
    bowlingType: 'Yorker',
    shotType: 'Straight',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },

  // Pace ball combinations
  {
    bowlingType: 'Pace',
    shotType: 'Straight',
    timingOutcomes: {
      Early: '1 run',
      Good: '3 runs',
      Perfect: '4 runs',
      Late: '2 runs',
    },
  },

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

  // Inswinger combinations
  {
    bowlingType: 'Inswinger',
    shotType: 'Flick',
    timingOutcomes: {
      Early: '1 run',
      Good: '3 runs',
      Perfect: '4 runs',
      Late: '2 runs',
    },
  },

  // Outswinger combinations
  {
    bowlingType: 'Outswinger',
    shotType: 'CoverDrive',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Outswinger',
    shotType: 'Pull',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Outswinger',
    shotType: 'Sweep',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },

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

  // Additional combinations for comprehensive coverage
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
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Bouncer',
    shotType: 'Long On',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '2 runs',
      Late: '1 wicket',
    },
  },

  // Additional missing combinations for Straight shots
  {
    bowlingType: 'Bouncer',
    shotType: 'Straight',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Outswinger',
    shotType: 'Straight',
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
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },

  // Super Over specific combinations - Leg Cutter
  {
    bowlingType: 'Leg Cutter',
    shotType: 'Straight',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Leg Cutter',
    shotType: 'Flick',
    timingOutcomes: {
      Early: '1 run',
      Good: '3 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Leg Cutter',
    shotType: 'Sweep',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Leg Cutter',
    shotType: 'SquareCut',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
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

  // Super Over specific combinations - Off Cutter
  {
    bowlingType: 'Off Cutter',
    shotType: 'Flick',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '3 runs',
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

  // Missing Bouncer combinations
  {
    bowlingType: 'Bouncer',
    shotType: 'Flick',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Bouncer',
    shotType: 'SquareCut',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Bouncer',
    shotType: 'CoverDrive',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Bouncer',
    shotType: 'Scoop',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '4 runs',
      Perfect: '6 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Bouncer',
    shotType: 'LegGlance',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },

  // Missing Inswinger combinations
  {
    bowlingType: 'Inswinger',
    shotType: 'Straight',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Inswinger',
    shotType: 'Long On',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Inswinger',
    shotType: 'SquareCut',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Inswinger',
    shotType: 'Sweep',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Inswinger',
    shotType: 'CoverDrive',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Inswinger',
    shotType: 'Pull',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Inswinger',
    shotType: 'Scoop',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '4 runs',
      Perfect: '6 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Inswinger',
    shotType: 'LegGlance',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Inswinger',
    shotType: 'UpperCut',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },

  // Missing Outswinger combinations
  {
    bowlingType: 'Outswinger',
    shotType: 'Flick',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Outswinger',
    shotType: 'Long On',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Outswinger',
    shotType: 'SquareCut',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Outswinger',
    shotType: 'Pull',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Outswinger',
    shotType: 'Scoop',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '4 runs',
      Perfect: '6 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Outswinger',
    shotType: 'LegGlance',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Outswinger',
    shotType: 'UpperCut',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },

  // Missing Leg Cutter combinations
  {
    bowlingType: 'Leg Cutter',
    shotType: 'Long On',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Leg Cutter',
    shotType: 'Pull',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Leg Cutter',
    shotType: 'Scoop',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '4 runs',
      Perfect: '6 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Leg Cutter',
    shotType: 'UpperCut',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },

  // Missing Off Cutter combinations
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
    shotType: 'Pull',
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
      Good: '4 runs',
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
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Off Cutter',
    shotType: 'UpperCut',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },

  // Missing Slower Ball combinations
  {
    bowlingType: 'Slower Ball',
    shotType: 'Flick',
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
    shotType: 'Sweep',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Slower Ball',
    shotType: 'Pull',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Slower Ball',
    shotType: 'Scoop',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '4 runs',
      Perfect: '6 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Slower Ball',
    shotType: 'LegGlance',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Slower Ball',
    shotType: 'UpperCut',
    timingOutcomes: {
      Early: '1 run',
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
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
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
    shotType: 'Long On',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
];

export const DEFAULT_OUTCOME: ShotOutcome = '2 runs';

/**
 * Get outcome rule for specific bowling-shot combination
 */
export function getOutcomeRule(
  bowlingType: BowlingType,
  shotType: ShotType
): OutcomeRule | undefined {
  return OUTCOME_RULES.find(
    rule => rule.bowlingType === bowlingType && rule.shotType === shotType
  );
}

/**
 * Check if a bowling-shot combination is valid
 */
export function isValidCombination(
  bowlingType: BowlingType,
  shotType: ShotType
): boolean {
  return getOutcomeRule(bowlingType, shotType) !== undefined;
}
