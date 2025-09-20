/**
 * Cricket Realism Rules Configuration
 * Defines unrealistic bowling-shot combinations with realistic cricket outcomes
 */

import { BowlingType, ShotType, ShotOutcome } from '../types';

interface UnrealisticCombination {
  bowlingType: BowlingType;
  shotType: ShotType;
  reason: string;
  realisticOutcome: ShotOutcome; // '0 runs' or '1 wicket' based on whether ball can hit stumps
  alternativeSuggestion?: string;
}

const UNREALISTIC_COMBINATIONS: UnrealisticCombination[] = [
  {
    bowlingType: 'Bouncer',
    shotType: 'Sweep',
    reason: 'You cannot sweep a bouncer - the ball is too high!',
    realisticOutcome: '0 runs', // Bouncer cannot hit stumps
    alternativeSuggestion: 'Try Pull or UpperCut instead',
  },
  {
    bowlingType: 'Yorker',
    shotType: 'Sweep',
    reason: 'Sweeping a yorker is extremely difficult and risky',
    realisticOutcome: '1 wicket', // Yorker can hit stumps
    alternativeSuggestion: 'Try Straight or Flick instead',
  },
  {
    bowlingType: 'Doosra',
    shotType: 'Scoop',
    reason: 'Scooping a doosra is extremely risky and rarely attempted',
    realisticOutcome: '1 wicket', // Doosra can hit stumps
    alternativeSuggestion: 'Try Flick or LegGlance instead',
  },
  {
    bowlingType: 'Bouncer',
    shotType: 'LegGlance',
    reason: 'Leg glancing a bouncer is very difficult due to the height',
    realisticOutcome: '0 runs', // Bouncer cannot hit stumps
    alternativeSuggestion: 'Try Pull or UpperCut instead',
  },
  {
    bowlingType: 'Yorker',
    shotType: 'UpperCut',
    reason: 'Upper cutting a yorker is nearly impossible',
    realisticOutcome: '1 wicket', // Yorker can hit stumps
    alternativeSuggestion: 'Try Straight or Flick instead',
  },
  {
    bowlingType: 'Pace',
    shotType: 'Scoop',
    reason: 'Scooping a fast pace ball is extremely risky',
    realisticOutcome: '1 wicket', // Pace can hit stumps
    alternativeSuggestion: 'Try Straight or CoverDrive instead',
  },
  {
    bowlingType: 'Leg Cutter',
    shotType: 'Scoop',
    reason: 'Scooping a leg cutter is very difficult',
    realisticOutcome: '1 wicket', // Leg Cutter can hit stumps
    alternativeSuggestion: 'Try Flick or LegGlance instead',
  },
  {
    bowlingType: 'Slower Ball',
    shotType: 'UpperCut',
    reason: 'Upper cutting a slower ball is counterproductive',
    realisticOutcome: '1 wicket', // Slower Ball can hit stumps
    alternativeSuggestion: 'Try Straight or SquareCut instead',
  },
  {
    bowlingType: 'Bouncer',
    shotType: 'Scoop',
    reason: 'Scooping a bouncer is impossible due to the height',
    realisticOutcome: '0 runs', // Bouncer cannot hit stumps
    alternativeSuggestion: 'Try Pull or UpperCut instead',
  },
  {
    bowlingType: 'Inswinger',
    shotType: 'Sweep',
    reason: 'Sweeping an inswinger is very risky',
    realisticOutcome: '1 wicket', // Inswinger can hit stumps
    alternativeSuggestion: 'Try Flick or LegGlance instead',
  },
  {
    bowlingType: 'Outswinger',
    shotType: 'Scoop',
    reason: 'Scooping an outswinger is extremely difficult',
    realisticOutcome: '1 wicket', // Outswinger can hit stumps
    alternativeSuggestion: 'Try CoverDrive or SquareCut instead',
  },
  {
    bowlingType: 'Off Break',
    shotType: 'Scoop',
    reason: 'Scooping an off break is very risky',
    realisticOutcome: '1 wicket', // Off Break can hit stumps
    alternativeSuggestion: 'Try Sweep or LegGlance instead',
  },
  {
    bowlingType: 'Off Cutter',
    shotType: 'UpperCut',
    reason: 'Upper cutting an off cutter is counterproductive',
    realisticOutcome: '1 wicket', // Off Cutter can hit stumps
    alternativeSuggestion: 'Try SquareCut or CoverDrive instead',
  },
];

/**
 * Check if a bowling-shot combination is unrealistic
 */
export function isUnrealisticCombination(
  bowlingType: BowlingType,
  shotType: ShotType
): UnrealisticCombination | undefined {
  return UNREALISTIC_COMBINATIONS.find(
    combo => combo.bowlingType === bowlingType && combo.shotType === shotType
  );
}

/**
 * Get realistic outcome for unrealistic combination
 */
export function getRealisticOutcomeForUnrealisticCombination(
  bowlingType: BowlingType,
  shotType: ShotType
): ShotOutcome | undefined {
  const combination = isUnrealisticCombination(bowlingType, shotType);
  return combination?.realisticOutcome;
}

/**
 * Get realistic outcome message for unrealistic combination
 */
export function getRealisticOutcomeMessage(
  bowlingType: BowlingType,
  shotType: ShotType
): string {
  const combination = isUnrealisticCombination(bowlingType, shotType);
  if (!combination) return '';

  if (combination.realisticOutcome === '0 runs') {
    return `Unrealistic shot attempt - ball misses stumps: ${combination.reason}`;
  } else {
    return `Unrealistic shot attempt - ball hits stumps: ${combination.reason}`;
  }
}

/**
 * Get realistic alternative suggestions for a bowling type
 */
export function getRealisticAlternatives(bowlingType: BowlingType): ShotType[] {
  const alternatives: Record<BowlingType, ShotType[]> = {
    Bouncer: ['Pull', 'UpperCut', 'Straight'],
    Yorker: ['Straight', 'Flick', 'LegGlance'],
    Pace: ['Straight', 'CoverDrive', 'SquareCut'],
    Inswinger: ['Flick', 'LegGlance', 'Straight'],
    Outswinger: ['CoverDrive', 'SquareCut', 'Straight'],
    'Off Break': ['Sweep', 'LegGlance', 'Flick'],
    'Leg Cutter': ['LegGlance', 'Flick', 'Straight'],
    'Off Cutter': ['SquareCut', 'CoverDrive', 'Straight'],
    'Slower Ball': ['Straight', 'SquareCut', 'CoverDrive'],
    Doosra: ['Flick', 'LegGlance', 'Sweep'],
  };

  return alternatives[bowlingType] || ['Straight', 'CoverDrive', 'Flick'];
}
