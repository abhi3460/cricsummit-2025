/**
 * Challenge 3 Service
 * Handles Super Over simulation logic with dependency injection
 */

import { BowlingType, ShotOutcome } from '../types';
import { IOutcomeEngine } from '../engines/outcome-engine';
import {
  SuperOverParser,
  SuperOverShotInput,
} from '../parsers/super-over-parser';
import {
  SuperOverFormatter,
  SuperOverResult,
  SuperOverBallResult,
  BallResult,
} from '../formatters/super-over-formatter';
import { GAME_CONSTANTS } from '../constants/game-rules';
import { InputValidationError, SuperOverError } from '../errors/cricket-errors';
import { isUnrealisticCombination } from '../config/cricket-realism-rules';

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

      // Use fixed target of 20 runs as per challenge requirements
      const targetRuns = GAME_CONSTANTS.SUPER_OVER.TARGET_RUNS;
      const randomBowlingCards = this.generateRandomBowlingCards();
      let scoredRuns = 0;
      let wicketsLost = 0;
      let ballsPlayed = 0;
      const balls: SuperOverBallResult[] = [];
      const errors: string[] = [];

      // Batsman rotation logic
      const allBatsmen = [
        GAME_CONSTANTS.PLAYERS.DEFAULT_BATSMAN,
        GAME_CONSTANTS.PLAYERS.DEFAULT_BATSMAN_2,
        GAME_CONSTANTS.PLAYERS.DEFAULT_BATSMAN_3,
        GAME_CONSTANTS.PLAYERS.DEFAULT_BATSMAN_4,
      ];
      let batsmanOnStrike: string = allBatsmen[0];
      let batsmanAtNonStrike: string = allBatsmen[1];
      let nextBatsmanIndex = 2; // Index for next batsman to come in

      for (
        let i = 0;
        i < parseResult.data.length &&
        wicketsLost < GAME_CONSTANTS.SUPER_OVER.MAX_WICKETS;
        i++
      ) {
        const shotInput = parseResult.data[i];
        const bowlingType = randomBowlingCards[i];

        const ballResult = this.processBall(i + 1, bowlingType, shotInput);

        // Add batsman information to ball result
        const ballResultWithBatsman: SuperOverBallResult = {
          ...ballResult,
          batsmanOnStrike,
        };

        balls.push(ballResultWithBatsman);
        ballsPlayed++;

        // Check if this was an unrealistic combination and add to errors if needed
        const unrealisticCombo = isUnrealisticCombination(
          bowlingType,
          shotInput.shotType
        );
        if (unrealisticCombo) {
          const outcomeMessage =
            ballResult.outcome === '0 runs'
              ? 'ball misses stumps'
              : 'ball hits stumps';
          errors.push(
            `Ball ${i + 1}: ${unrealisticCombo.reason} - ${outcomeMessage}`
          );
        }

        if (ballResult.outcome === '1 wicket') {
          wicketsLost++;

          // New batsman comes in on strike
          if (nextBatsmanIndex < allBatsmen.length) {
            batsmanOnStrike = allBatsmen[nextBatsmanIndex];
            nextBatsmanIndex++;
          }
          // Note: In real cricket, the non-striker stays the same unless it's the last wicket
        } else {
          scoredRuns += this.extractRunsFromOutcome(ballResult.outcome);

          // Rotate batsmen on odd runs (1, 3, 5)
          const runs = this.extractRunsFromOutcome(ballResult.outcome);
          if (runs % 2 === 1) {
            // Swap batsmen
            const temp = batsmanOnStrike;
            batsmanOnStrike = batsmanAtNonStrike;
            batsmanAtNonStrike = temp;
          }
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
        errors, // Include errors in the result
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
  ): BallResult {
    const outcome = this.outcomeEngine.predictOutcome(
      bowlingType,
      shotInput.shotType,
      shotInput.shotTiming
    );

    return {
      ballNumber,
      bowlingType,
      shotType: shotInput.shotType,
      shotTiming: shotInput.shotTiming,
      outcome,
    };
  }

  /**
   * Generates randomized bowling cards for 6 balls
   * Ensures variety and realistic bowling strategy
   */
  private generateRandomBowlingCards(): BowlingType[] {
    const shuffledCards = [...this.bowlingCards].sort(
      () => Math.random() - 0.5
    );

    // Ensure we have exactly 6 bowling cards for 6 balls
    const bowlingCardsForMatch: BowlingType[] = [];
    for (let i = 0; i < GAME_CONSTANTS.SUPER_OVER.TOTAL_BALLS; i++) {
      bowlingCardsForMatch.push(shuffledCards[i % shuffledCards.length]);
    }
    return bowlingCardsForMatch;
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
