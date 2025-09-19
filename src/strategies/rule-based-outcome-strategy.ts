/**
 * Rule-Based Outcome Strategy
 * Uses predefined rules to predict cricket outcomes
 */

import { BowlingType, ShotType, ShotTiming, ShotOutcome } from '../types';
import { IOutcomeStrategy } from './outcome-strategy.interface';
import {
  OUTCOME_RULES,
  DEFAULT_OUTCOME,
  getOutcomeRule,
} from '../config/outcome-rules';
import { OutcomePredictionError } from '../errors/cricket-errors';

export class RuleBasedOutcomeStrategy implements IOutcomeStrategy {
  private readonly outcomeMap: Map<string, ShotOutcome> = new Map();

  constructor() {
    this.initializeOutcomeMap();
  }

  predictOutcome(
    bowlingType: BowlingType,
    shotType: ShotType,
    timing: ShotTiming
  ): ShotOutcome {
    try {
      const key = this.generateKey(bowlingType, shotType, timing);
      const outcome = this.outcomeMap.get(key);

      if (!outcome) {
        // Log the missing combination for debugging
        console.warn(
          `No rule found for combination: ${bowlingType} + ${shotType} + ${timing}`
        );
        return DEFAULT_OUTCOME;
      }

      return outcome;
    } catch (err) {
      // Type assertion for error handling
      const error = (err as Error)?.message || 'Unknown error';
      throw new OutcomePredictionError(
        `Failed to predict outcome for ${bowlingType} + ${shotType} + ${timing}`,
        {
          bowlingType,
          shotType,
          timing,
          error,
        }
      );
    }
  }

  getName(): string {
    return 'Rule-Based Strategy';
  }

  getDescription(): string {
    return 'Uses predefined rules from configuration to predict outcomes based on bowling type, shot type, and timing combinations.';
  }

  getTotalRules(): number {
    return this.outcomeMap.size;
  }

  isValidCombination(bowlingType: BowlingType, shotType: ShotType): boolean {
    const rule = getOutcomeRule(bowlingType, shotType);
    return rule !== undefined;
  }

  private initializeOutcomeMap(): void {
    OUTCOME_RULES.forEach(rule => {
      Object.entries(rule.timingOutcomes).forEach(([timing, outcome]) => {
        const key = this.generateKey(
          rule.bowlingType,
          rule.shotType,
          timing as ShotTiming
        );
        this.outcomeMap.set(key, outcome);
      });
    });
  }

  private generateKey(
    bowlingType: BowlingType,
    shotType: ShotType,
    timing: ShotTiming
  ): string {
    return `${bowlingType}|${shotType}|${timing}`;
  }

  getAvailableCombinations(): string[] {
    return Array.from(this.outcomeMap.keys());
  }
}
