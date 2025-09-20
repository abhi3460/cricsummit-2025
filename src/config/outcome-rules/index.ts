/**
 * Outcome Rules Index
 * Consolidates all bowling type rules and provides utility functions
 */

import { BowlingType, ShotType, ShotOutcome, OutcomeRule } from '../../types';
import { FAST_BOWLING_RULES } from './fast-bowling-rules';
import { SWING_BOWLING_RULES } from './swing-bowling-rules';
import { SPIN_BOWLING_RULES } from './spin-bowling-rules';
import { VARIATION_BOWLING_RULES } from './variation-bowling-rules';

// Consolidate all rules
export const OUTCOME_RULES: OutcomeRule[] = [
  ...FAST_BOWLING_RULES,
  ...SWING_BOWLING_RULES,
  ...SPIN_BOWLING_RULES,
  ...VARIATION_BOWLING_RULES,
];

export const DEFAULT_OUTCOME: ShotOutcome = '1 run';

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

/**
 * Get all rules for a specific bowling type
 */
export function getRulesForBowlingType(
  bowlingType: BowlingType
): OutcomeRule[] {
  return OUTCOME_RULES.filter(rule => rule.bowlingType === bowlingType);
}

/**
 * Get all rules for a specific shot type
 */
export function getRulesForShotType(shotType: ShotType): OutcomeRule[] {
  return OUTCOME_RULES.filter(rule => rule.shotType === shotType);
}

/**
 * Get all supported bowling types
 */
export function getSupportedBowlingTypes(): BowlingType[] {
  const bowlingTypes = new Set<BowlingType>();
  OUTCOME_RULES.forEach(rule => bowlingTypes.add(rule.bowlingType));
  return Array.from(bowlingTypes);
}

/**
 * Get all supported shot types
 */
export function getSupportedShotTypes(): ShotType[] {
  const shotTypes = new Set<ShotType>();
  OUTCOME_RULES.forEach(rule => shotTypes.add(rule.shotType));
  return Array.from(shotTypes);
}

/**
 * Get statistics about the rules
 */
export function getRuleStatistics(): {
  totalRules: number;
  bowlingTypeCount: number;
  shotTypeCount: number;
  averageRulesPerBowlingType: number;
} {
  const bowlingTypes = getSupportedBowlingTypes();
  const shotTypes = getSupportedShotTypes();

  return {
    totalRules: OUTCOME_RULES.length,
    bowlingTypeCount: bowlingTypes.length,
    shotTypeCount: shotTypes.length,
    averageRulesPerBowlingType: Math.round(
      OUTCOME_RULES.length / bowlingTypes.length
    ),
  };
}

// Re-export individual rule sets for specific use cases
export { FAST_BOWLING_RULES } from './fast-bowling-rules';
export { SWING_BOWLING_RULES } from './swing-bowling-rules';
export { SPIN_BOWLING_RULES } from './spin-bowling-rules';
export { VARIATION_BOWLING_RULES } from './variation-bowling-rules';
