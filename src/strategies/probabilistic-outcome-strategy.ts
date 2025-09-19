/**
 * Probabilistic Outcome Strategy
 * Uses probability-based calculations to predict cricket outcomes
 */

import { BowlingType, ShotType, ShotTiming, ShotOutcome } from '../types';
import { IOutcomeStrategy } from './outcome-strategy.interface';
import { OutcomePredictionError } from '../errors/cricket-errors';

export class ProbabilisticOutcomeStrategy implements IOutcomeStrategy {
  private readonly timingMultipliers: Map<ShotTiming, number> = new Map([
    ['Early', 0.6],
    ['Good', 0.8],
    ['Perfect', 1.0],
    ['Late', 0.4],
  ]);

  private readonly bowlingDifficulty: Map<BowlingType, number> = new Map([
    ['Bouncer', 0.8],
    ['Yorker', 0.9],
    ['Pace', 0.6],
    ['Off Break', 0.7],
    ['Inswinger', 0.7],
    ['Outswinger', 0.7],
    ['Slower Ball', 0.8],
    ['Leg Cutter', 0.8],
    ['Off Cutter', 0.8],
    ['Doosra', 0.9],
  ]);

  private readonly shotRisk: Map<ShotType, number> = new Map([
    ['Straight', 0.3],
    ['Sweep', 0.6],
    ['Flick', 0.4],
    ['CoverDrive', 0.5],
    ['LegGlance', 0.4],
    ['Pull', 0.7],
    ['Long On', 0.8],
    ['Scoop', 0.9],
    ['SquareCut', 0.6],
    ['UpperCut', 0.8],
  ]);

  predictOutcome(
    bowlingType: BowlingType,
    shotType: ShotType,
    timing: ShotTiming
  ): ShotOutcome {
    try {
      // Using optional chaining and nullish coalescing
      const timingMultiplier = this.timingMultipliers.get(timing) ?? 0.5;
      const bowlingDifficulty = this.bowlingDifficulty.get(bowlingType) ?? 0.7;
      const shotRisk = this.shotRisk.get(shotType) ?? 0.5;

      // Calculate success probability
      const successProbability =
        timingMultiplier * (1 - bowlingDifficulty * 0.5) * (1 - shotRisk * 0.3);

      // Calculate wicket probability
      const wicketProbability =
        (1 - timingMultiplier) * bowlingDifficulty * shotRisk;

      // Generate random number for outcome determination
      const random = Math.random();

      if (random < wicketProbability * 0.3) {
        return '1 wicket';
      }

      // Determine runs based on success probability and shot aggression
      const runsProbability = successProbability * (shotRisk + 0.3);

      if (runsProbability > 0.9) return '6 runs';
      if (runsProbability > 0.8) return '4 runs';
      if (runsProbability > 0.6) return '3 runs';
      if (runsProbability > 0.4) return '2 runs';
      return '1 run';
    } catch (err) {
      // Type assertion with optional chaining
      const error = (err as Error)?.message ?? 'Unknown error';
      throw new OutcomePredictionError(
        `Failed to predict outcome using probabilistic strategy for ${bowlingType} + ${shotType} + ${timing}`,
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
    return 'Probabilistic Strategy';
  }

  getDescription(): string {
    return 'Uses probability-based calculations considering timing quality, bowling difficulty, and shot risk to predict outcomes.';
  }

  isValidCombination(bowlingType: BowlingType, shotType: ShotType): boolean {
    // Probabilistic strategy can handle any valid combination
    return (
      this.bowlingDifficulty.has(bowlingType) && this.shotRisk.has(shotType)
    );
  }

  // Additional methods for strategy configuration
  setTimingMultiplier(timing: ShotTiming, multiplier: number): void {
    if (multiplier < 0 || multiplier > 1) {
      throw new Error('Timing multiplier must be between 0 and 1');
    }
    this.timingMultipliers.set(timing, multiplier);
  }

  setBowlingDifficulty(bowling: BowlingType, difficulty: number): void {
    if (difficulty < 0 || difficulty > 1) {
      throw new Error('Bowling difficulty must be between 0 and 1');
    }
    this.bowlingDifficulty.set(bowling, difficulty);
  }

  setShotRisk(shot: ShotType, risk: number): void {
    if (risk < 0 || risk > 1) {
      throw new Error('Shot risk must be between 0 and 1');
    }
    this.shotRisk.set(shot, risk);
  }
}
