/**
 * Challenge 2 Service
 * Handles commentary generation logic with dependency injection
 */

import { ShotOutcome } from '../types';
import { IOutcomeEngine } from '../engines/outcome-engine';
import { ICommentaryEngine } from '../engines/commentary-engine';
import { CricketInputParser } from '../parsers/cricket-input-parser';
import {
  CommentaryFormatter,
  CommentaryOutput,
} from '../formatters/commentary-formatter';
import {
  InputValidationError,
  OutcomePredictionError,
} from '../errors/cricket-errors';
import { getRealisticAlternatives } from '../config/cricket-realism-rules';

export interface IChallenge2Service {
  processInput(input: string): CommentaryOutput[];
  processInputLines(inputLines: string[]): CommentaryOutput[];
  formatOutput(outputs: CommentaryOutput[]): string[];
  getSampleInput(): string[];
  getSampleOutput(): CommentaryOutput[];
  validateInput(input: string): boolean;
  getValidInputFormats(): {
    bowlingTypes: string[];
    shotTypes: string[];
    shotTimings: string[];
  };
}

export class Challenge2Service implements IChallenge2Service {
  constructor(
    private readonly outcomeEngine: IOutcomeEngine,
    private readonly commentaryEngine: ICommentaryEngine,
    private readonly inputParser: CricketInputParser,
    private readonly outputFormatter: CommentaryFormatter
  ) {}

  processInput(input: string): CommentaryOutput[] {
    const lines = input.split('\n').filter(line => line.trim());
    return this.processInputLines(lines);
  }

  processInputLines(inputLines: string[]): CommentaryOutput[] {
    const parseResult = this.inputParser.parseMultiple(inputLines);

    if (!parseResult.success || !parseResult.data) {
      throw new InputValidationError(
        parseResult.error || 'Failed to parse input',
        { inputLines }
      );
    }

    const results: CommentaryOutput[] = [];

    for (const cricketInput of parseResult.data) {
      try {
        const outcome = this.outcomeEngine.predictOutcome(
          cricketInput.bowlingType,
          cricketInput.shotType,
          cricketInput.shotTiming
        );

        const commentary = this.commentaryEngine.getCommentaryText(outcome);

        results.push({
          commentary,
          outcome,
        });
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

  formatOutput(outputs: CommentaryOutput[]): string[] {
    return this.outputFormatter.formatMultiple(outputs);
  }

  getSampleInput(): string[] {
    return ['Bouncer Pull Late'];
  }

  getSampleOutput(): CommentaryOutput[] {
    return [
      {
        commentary: "It's a wicket.",
        outcome: '1 wicket',
      },
    ];
  }

  validateInput(input: string): boolean {
    return this.inputParser.validate(input);
  }

  generateCommentaryForOutcome(outcome: ShotOutcome): CommentaryOutput {
    const commentary = this.commentaryEngine.getCommentaryText(outcome);
    return {
      commentary,
      outcome,
    };
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
