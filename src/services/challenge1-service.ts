/**
 * Challenge 1 Service
 * Handles outcome prediction logic with dependency injection
 */

import { ShotOutcome } from '../types';
import { IOutcomeEngine } from '../engines/outcome-engine';
import { CricketInputParser } from '../parsers/cricket-input-parser';
import {
  InputValidationError,
  OutcomePredictionError,
} from '../errors/cricket-errors';
import { getRealisticAlternatives } from '../config/cricket-realism-rules';

export interface IChallenge1Service {
  processInput(input: string): ShotOutcome[];
  processInputLines(inputLines: string[]): ShotOutcome[];
  getSampleInput(): string[];
  getSampleOutput(): ShotOutcome[];
  validateInput(input: string): boolean;
  getValidInputFormats(): {
    bowlingTypes: string[];
    shotTypes: string[];
    shotTimings: string[];
  };
}

export class Challenge1Service implements IChallenge1Service {
  constructor(
    private readonly outcomeEngine: IOutcomeEngine,
    private readonly inputParser: CricketInputParser
  ) {}

  processInput(input: string): ShotOutcome[] {
    const lines = input.split('\n').filter(line => line.trim());
    return this.processInputLines(lines);
  }

  processInputLines(inputLines: string[]): ShotOutcome[] {
    const parseResult = this.inputParser.parseMultiple(inputLines);

    if (!parseResult.success || !parseResult.data) {
      throw new InputValidationError(
        parseResult.error || 'Failed to parse input',
        { inputLines }
      );
    }

    const results: ShotOutcome[] = [];

    for (const cricketInput of parseResult.data) {
      try {
        const outcome = this.outcomeEngine.predictOutcome(
          cricketInput.bowlingType,
          cricketInput.shotType,
          cricketInput.shotTiming
        );
        results.push(outcome);
      } catch (error) {
        if (
          error instanceof OutcomePredictionError &&
          error.context?.isUnrealistic
        ) {
          // For unrealistic combinations, provide helpful feedback
          const alternatives = getRealisticAlternatives(
            cricketInput.bowlingType
          );
          const suggestion =
            error.context.alternativeSuggestion ||
            `Try one of these realistic shots: ${alternatives.join(', ')}`;

          throw new OutcomePredictionError(
            `${error.message}\n💡 ${suggestion}`,
            error.context
          );
        }
        throw error;
      }
    }

    return results;
  }

  getSampleInput(): string[] {
    return [
      'Bouncer Pull Perfect',
      'Yorker Straight Early',
      'Pace Straight Good',
    ];
  }

  getSampleOutput(): ShotOutcome[] {
    return ['6 runs', '1 wicket', '3 runs'];
  }

  validateInput(input: string): boolean {
    return this.inputParser.validate(input);
  }

  getValidInputFormats(): {
    bowlingTypes: string[];
    shotTypes: string[];
    shotTimings: string[];
  } {
    return {
      bowlingTypes: this.inputParser.getValidBowlingTypes(),
      shotTypes: this.inputParser.getValidShotTypes(),
      shotTimings: this.inputParser.getValidShotTimings(),
    };
  }
}
