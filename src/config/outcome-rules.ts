/**
 * Outcome Rules Configuration - Legacy Interface
 * Re-exports from modular outcome rules structure for backward compatibility
 *
 * @deprecated Use specific rule modules from './outcome-rules/' instead
 */

// Re-export everything from the new modular structure
export {
  OUTCOME_RULES,
  DEFAULT_OUTCOME,
  getOutcomeRule,
  isValidCombination,
  getRulesForBowlingType,
  getRulesForShotType,
  getSupportedBowlingTypes,
  getSupportedShotTypes,
  getRuleStatistics,
  FAST_BOWLING_RULES,
  SWING_BOWLING_RULES,
  SPIN_BOWLING_RULES,
  VARIATION_BOWLING_RULES,
} from './outcome-rules/index';
