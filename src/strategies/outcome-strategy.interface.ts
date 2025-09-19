/**
 * Outcome Strategy Interface
 * Defines the contract for outcome prediction strategies
 */

import { BowlingType, ShotType, ShotTiming, ShotOutcome } from '../types';

export interface IOutcomeStrategy {
  predictOutcome(
    bowlingType: BowlingType,
    shotType: ShotType,
    timing: ShotTiming
  ): ShotOutcome;

  getName(): string;
  getDescription(): string;
  isValidCombination(bowlingType: BowlingType, shotType: ShotType): boolean;
}
