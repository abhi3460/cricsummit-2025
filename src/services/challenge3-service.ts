/**
 * Challenge 3 Service
 * Handles Super Over simulation logic with dependency injection
 */

import { BowlingType, ShotOutcome } from '../types';
import { IOutcomeEngine } from '../engines/outcome-engine';
import { ICommentaryEngine } from '../engines/commentary-engine';
import {
  SuperOverParser,
  SuperOverShotInput,
} from '../parsers/super-over-parser';
import {
  SuperOverFormatter,
  SuperOverResult,
  SuperOverBallResult,
} from '../formatters/super-over-formatter';
import { GAME_CONSTANTS } from '../constants/game-rules';
import { InputValidationError, SuperOverError } from '../errors/cricket-errors';

export interface IChallenge3Service {
  processInput(input: string): string[];
  processSuperOver(shotInputs: string[]): SuperOverResult;
  formatOutput(result: SuperOverResult): string[];
  getSampleInput(): string[];
  validateInput(input: string): boolean;
  getValidInputFormats(): {
    shotTypes: string[];
    shotTimings: string[];
  };
}

export class Challenge3Service implements IChallenge3Service {
  private readonly bowlingCards: BowlingType[] = [
    'Bouncer',
    'Inswinger',
    'Outswinger',
    'Leg Cutter',
    'Off Cutter',
    'Slower Ball',
  ];

  constructor(
    private readonly outcomeEngine: IOutcomeEngine,
    private readonly commentaryEngine: ICommentaryEngine,
    private readonly inputParser: SuperOverParser,
    private readonly outputFormatter: SuperOverFormatter
  ) {}

  processInput(input: string): string[] {
    const lines = input.split('\n').filter(line => line.trim());
    const result = this.processSuperOver(lines);
    return this.formatOutput(result);
  }

  processSuperOver(shotInputs: string[]): SuperOverResult {
    try {
      // Validate exactly 6 shot inputs
      if (shotInputs.length !== GAME_CONSTANTS.SUPER_OVER.TOTAL_BALLS) {
        throw new InputValidationError(
          `Super Over requires exactly ${GAME_CONSTANTS.SUPER_OVER.TOTAL_BALLS} shot inputs, got ${shotInputs.length}`,
          {
            shotInputs,
            expected: GAME_CONSTANTS.SUPER_OVER.TOTAL_BALLS,
            actual: shotInputs.length,
          }
        );
      }

      const parseResult = this.inputParser.parseMultiple(shotInputs);

      if (!parseResult.success || !parseResult.data) {
        throw new InputValidationError(
          parseResult.error || 'Failed to parse Super Over input',
          { shotInputs }
        );
      }

      const targetRuns = this.generateTargetRuns();
      let scoredRuns = 0;
      let wicketsLost = 0;
      let ballsPlayed = 0;
      const balls: SuperOverBallResult[] = [];

      for (
        let i = 0;
        i < parseResult.data.length &&
        wicketsLost < GAME_CONSTANTS.SUPER_OVER.MAX_WICKETS;
        i++
      ) {
        const shotInput = parseResult.data[i];
        const bowlingType = this.bowlingCards[i];

        const ballResult = this.processBall(i + 1, bowlingType, shotInput);

        balls.push(ballResult);
        ballsPlayed++;

        if (ballResult.outcome === '1 wicket') {
          wicketsLost++;
        } else {
          scoredRuns += this.extractRunsFromOutcome(ballResult.outcome);
        }

        // Check if target is achieved or all wickets are lost
        if (
          (scoredRuns >= targetRuns &&
            wicketsLost < GAME_CONSTANTS.SUPER_OVER.MAX_WICKETS) ||
          wicketsLost >= GAME_CONSTANTS.SUPER_OVER.MAX_WICKETS
        ) {
          break;
        }
      }

      const matchResult = this.determineMatchResult(
        scoredRuns,
        targetRuns,
        wicketsLost
      );
      const margin = this.calculateMargin(
        scoredRuns,
        targetRuns,
        wicketsLost,
        ballsPlayed,
        matchResult
      );

      return {
        targetRuns,
        scoredRuns,
        wicketsLost,
        ballsPlayed,
        matchResult,
        margin,
        balls,
      };
    } catch (error) {
      if (error instanceof InputValidationError) {
        throw error;
      }

      throw new SuperOverError(
        `Failed to process Super Over: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { shotInputs }
      );
    }
  }

  formatOutput(result: SuperOverResult): string[] {
    const formatted = this.outputFormatter.format(result);
    return formatted.split('\n').filter(line => line.trim());
  }

  getSampleInput(): string[] {
    return [
      'Straight Perfect',
      'Flick Early',
      'Sweep Good',
      'LegGlance Good',
      'SquareCut Late',
      'CoverDrive Perfect',
    ];
  }

  private processBall(
    ballNumber: number,
    bowlingType: BowlingType,
    shotInput: SuperOverShotInput
  ): SuperOverBallResult {
    const outcome = this.outcomeEngine.predictOutcome(
      bowlingType,
      shotInput.shotType,
      shotInput.shotTiming
    );

    const commentary = this.commentaryEngine.getCommentaryText(outcome);

    return {
      ballNumber,
      bowlingType,
      shotType: shotInput.shotType,
      shotTiming: shotInput.shotTiming,
      outcome,
      commentary,
    };
  }

  private generateTargetRuns(): number {
    return (
      Math.floor(
        Math.random() *
          (GAME_CONSTANTS.SUPER_OVER.MAX_TARGET_RUNS -
            GAME_CONSTANTS.SUPER_OVER.MIN_TARGET_RUNS +
            1)
      ) + GAME_CONSTANTS.SUPER_OVER.MIN_TARGET_RUNS
    );
  }

  private extractRunsFromOutcome(outcome: ShotOutcome): number {
    if (outcome === '1 wicket') return 0;

    const runsMatch = outcome.match(/(\d+)\s+runs?/);
    return runsMatch ? parseInt(runsMatch[1], 10) : 0;
  }

  private determineMatchResult(
    scoredRuns: number,
    targetRuns: number,
    wicketsLost: number
  ): 'won' | 'lost' {
    return scoredRuns >= targetRuns &&
      wicketsLost < GAME_CONSTANTS.SUPER_OVER.MAX_WICKETS
      ? 'won'
      : 'lost';
  }

  private calculateMargin(
    scoredRuns: number,
    targetRuns: number,
    wicketsLost: number,
    ballsPlayed: number,
    matchResult: 'won' | 'lost'
  ): string {
    if (matchResult === 'won') {
      if (wicketsLost === 0) {
        const ballsRemaining =
          GAME_CONSTANTS.SUPER_OVER.TOTAL_BALLS - ballsPlayed;
        return ballsRemaining === 1 ? '1 ball' : `${ballsRemaining} balls`;
      } else {
        const wicketsRemaining =
          GAME_CONSTANTS.SUPER_OVER.MAX_WICKETS - wicketsLost;
        return wicketsRemaining === 1
          ? '1 wicket'
          : `${wicketsRemaining} wickets`;
      }
    } else {
      // For lost matches, show runs short or wickets lost
      if (wicketsLost >= GAME_CONSTANTS.SUPER_OVER.MAX_WICKETS) {
        return `${wicketsLost} wickets`;
      } else {
        const runsShort = targetRuns - scoredRuns;
        return runsShort === 1 ? '1 run' : `${runsShort} runs`;
      }
    }
  }

  validateInput(input: string): boolean {
    return this.inputParser.validate(input);
  }

  getValidInputFormats(): {
    shotTypes: string[];
    shotTimings: string[];
  } {
    return {
      shotTypes: this.inputParser.getValidShotTypes(),
      shotTimings: this.inputParser.getValidShotTimings(),
    };
  }
}
