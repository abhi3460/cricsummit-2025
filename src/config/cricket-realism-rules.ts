/**
 * Cricket Realism Rules Configuration
 * Defines unrealistic bowling-shot combinations with fun error messages
 */

import { BowlingType, ShotType } from '../types';

interface UnrealisticCombination {
  bowlingType: BowlingType;
  shotType: ShotType;
  reason: string;
  funMessage: string;
  alternativeSuggestion?: string;
}

const UNREALISTIC_COMBINATIONS: UnrealisticCombination[] = [
  {
    bowlingType: 'Bouncer',
    shotType: 'Sweep',
    reason: 'You cannot sweep a bouncer - the ball is too high!',
    funMessage:
      "🏏 'Sweeping a bouncer? That's like trying to sweep the ceiling! The ball is way up there, mate!'",
    alternativeSuggestion: 'Try Pull or UpperCut instead',
  },
  {
    bowlingType: 'Yorker',
    shotType: 'Sweep',
    reason: 'Sweeping a yorker is extremely difficult and risky',
    funMessage:
      "🏏 'Sweeping a yorker? Good luck with that! You might as well try to sweep the floor while the ball is at your toes!'",
    alternativeSuggestion: 'Try Straight or Flick instead',
  },
  {
    bowlingType: 'Doosra',
    shotType: 'Scoop',
    reason: 'Scooping a doosra is extremely risky and rarely attempted',
    funMessage:
      "🏏 'Scooping a doosra? That's like trying to scoop ice cream with a spoon that keeps changing direction!'",
    alternativeSuggestion: 'Try Flick or LegGlance instead',
  },
  {
    bowlingType: 'Bouncer',
    shotType: 'LegGlance',
    reason: 'Leg glancing a bouncer is very difficult due to the height',
    funMessage:
      "🏏 'Leg glancing a bouncer? The ball is at your head level, not your legs! Physics called, they want their laws back!'",
    alternativeSuggestion: 'Try Pull or UpperCut instead',
  },
  {
    bowlingType: 'Yorker',
    shotType: 'UpperCut',
    reason: 'Upper cutting a yorker is nearly impossible',
    funMessage:
      "🏏 'Upper cutting a yorker? That's like trying to uppercut someone who's already on the ground!'",
    alternativeSuggestion: 'Try Straight or Flick instead',
  },
  {
    bowlingType: 'Pace',
    shotType: 'Scoop',
    reason: 'Scooping a fast pace ball is extremely risky',
    funMessage:
      "🏏 'Scooping a pace ball? That's like trying to scoop a bullet! Good luck with that timing!'",
    alternativeSuggestion: 'Try Straight or CoverDrive instead',
  },
  {
    bowlingType: 'Leg Cutter',
    shotType: 'Scoop',
    reason: 'Scooping a leg cutter is very difficult',
    funMessage:
      "🏏 'Scooping a leg cutter? That's like trying to scoop soup with a knife! The ball is cutting away from you!'",
    alternativeSuggestion: 'Try Flick or LegGlance instead',
  },
  {
    bowlingType: 'Slower Ball',
    shotType: 'UpperCut',
    reason: 'Upper cutting a slower ball is counterproductive',
    funMessage:
      "🏏 'Upper cutting a slower ball? That's like trying to uppercut a feather! The ball is already slow, why make it slower?'",
    alternativeSuggestion: 'Try Straight or SquareCut instead',
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
 * Get a random fun message for any unrealistic combination
 */
export function getRandomFunMessage(): string {
  const messages = [
    "🏏 'That combination is so unrealistic, even the commentators are confused!'",
    "🏏 'Are you sure you're playing cricket and not some other sport?'",
    "🏏 'That shot would make even the most experienced batsman scratch their head!'",
    "🏏 'You've just invented a new shot! Call it the 'Impossible Shot'!'",
    "🏏 'That's not cricket, that's magic! And not the good kind!'",
    "🏏 'Even in a video game, that combination would be disabled!'",
    "🏏 'That's so unrealistic, the ball might just disappear!'",
    "🏏 'You've broken the laws of cricket physics!'",
    "🏏 'That combination is so rare, it's never been attempted in cricket history!'",
    "🏏 'Are you trying to play cricket or perform a magic trick?'",
  ];

  return messages[Math.floor(Math.random() * messages.length)];
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
