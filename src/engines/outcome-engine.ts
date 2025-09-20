/**
 * Outcome Engine for CRICSUMMIT'25
 * Uses dependency injection and strategy patterns for scalable outcome prediction
 */

import { BowlingType, ShotType, ShotTiming, ShotOutcome } from '../types';
import { IOutcomeStrategy } from '../strategies/outcome-strategy.interface';
import { RuleBasedOutcomeStrategy } from '../strategies/rule-based-outcome-strategy';
import {
  OutcomePredictionError,
  ConfigurationError,
} from '../errors/cricket-errors';
import {
  isUnrealisticCombination,
  getRealisticOutcomeForUnrealisticCombination,
} from '../config/cricket-realism-rules';

export interface IOutcomeEngine {
  predictOutcome(
    bowlingType: BowlingType,
    shotType: ShotType,
    timing: ShotTiming
  ): ShotOutcome;

  setStrategy(strategy: IOutcomeStrategy): void;
  getCurrentStrategy(): IOutcomeStrategy;
  isValidCombination(bowlingType: BowlingType, shotType: ShotType): boolean;
}

export class OutcomeEngine implements IOutcomeEngine {
  private strategy: IOutcomeStrategy;

  constructor(strategy?: IOutcomeStrategy) {
    // Default to rule-based strategy if none provided
    this.strategy = strategy || new RuleBasedOutcomeStrategy();
  }

  predictOutcome(
    bowlingType: BowlingType,
    shotType: ShotType,
    timing: ShotTiming
  ): ShotOutcome {
    try {
      if (!this.strategy) {
        throw new ConfigurationError('No outcome strategy configured');
      }

      // Check for unrealistic combinations first
      const unrealisticCombo = isUnrealisticCombination(bowlingType, shotType);
      if (unrealisticCombo) {
        // Return realistic outcome instead of throwing error
        return unrealisticCombo.realisticOutcome;
      }

      return this.strategy.predictOutcome(bowlingType, shotType, timing);
    } catch (error) {
      if (
        error instanceof OutcomePredictionError ||
        error instanceof ConfigurationError
      ) {
        throw error;
      }

      throw new OutcomePredictionError(
        `Unexpected error during outcome prediction: ${error instanceof Error ? error.message : 'Unknown error'}`,
        {
          bowlingType,
          shotType,
          timing,
          strategy: this.strategy?.getName(),
        }
      );
    }
  }

  setStrategy(strategy: IOutcomeStrategy): void {
    if (!strategy) {
      throw new ConfigurationError('Strategy cannot be null or undefined');
    }

    this.strategy = strategy;
  }

  getCurrentStrategy(): IOutcomeStrategy {
    return this.strategy;
  }

  isValidCombination(bowlingType: BowlingType, shotType: ShotType): boolean {
    if (!this.strategy) {
      return false;
    }

    return this.strategy.isValidCombination(bowlingType, shotType);
  }

  getStrategyInfo(): { name: string; description: string } {
    return {
      name: this.strategy.getName(),
      description: this.strategy.getDescription(),
    };
  }
}
