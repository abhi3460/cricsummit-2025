/**
 * Super Over Output Formatter
 * Handles formatting of Super Over match results
 */

import { IOutputFormatter } from './output-formatter.interface';
import { GAME_CONSTANTS } from '../constants/game-rules';
import { BowlingType, ShotType, ShotTiming, ShotOutcome } from '../types';

export interface SuperOverBallResult {
  ballNumber: number;
  bowlingType: BowlingType;
  shotType: ShotType;
  shotTiming: ShotTiming;
  outcome: ShotOutcome;
  commentary: string;
}

export interface SuperOverResult {
  targetRuns: number;
  scoredRuns: number;
  wicketsLost: number;
  ballsPlayed: number;
  matchResult: 'won' | 'lost';
  margin: string;
  balls: SuperOverBallResult[];
}

export class SuperOverFormatter implements IOutputFormatter<SuperOverResult> {
  format(data: SuperOverResult): string {
    const lines: string[] = [];

    // Show target score at the beginning
    lines.push(
      `${GAME_CONSTANTS.PLAYERS.DEFAULT_TEAM} needs ${data.targetRuns} runs to win`
    );
    lines.push(''); // Empty line

    // Format each ball
    for (const ball of data.balls) {
      lines.push(
        `${GAME_CONSTANTS.PLAYERS.DEFAULT_BOWLER} bowled ${ball.bowlingType} ball,`
      );
      lines.push(
        `${GAME_CONSTANTS.PLAYERS.DEFAULT_BATSMAN} played ${ball.shotTiming} ${ball.shotType} shot`
      );
      lines.push(`${ball.commentary} - ${ball.outcome}`);
      lines.push(''); // Empty line between balls
    }

    // Format match summary
    lines.push(
      `${GAME_CONSTANTS.PLAYERS.DEFAULT_TEAM} scored: ${data.scoredRuns} runs`
    );
    lines.push(
      `${GAME_CONSTANTS.PLAYERS.DEFAULT_TEAM} ${data.matchResult} by ${data.margin}`
    );

    return lines.join('\n');
  }

  formatMultiple(data: SuperOverResult[]): string[] {
    return data.map(result => this.format(result));
  }

  formatBallByBall(balls: SuperOverBallResult[]): string[] {
    const lines: string[] = [];

    for (const ball of balls) {
      lines.push(
        `${GAME_CONSTANTS.PLAYERS.DEFAULT_BOWLER} bowled ${ball.bowlingType} ball,`
      );
      lines.push(
        `${GAME_CONSTANTS.PLAYERS.DEFAULT_BATSMAN} played ${ball.shotTiming} ${ball.shotType} shot`
      );
      lines.push(`${ball.commentary} - ${ball.outcome}`);
      lines.push(''); // Empty line between balls
    }

    return lines;
  }

  formatMatchSummary(result: SuperOverResult): string[] {
    return [
      `${GAME_CONSTANTS.PLAYERS.DEFAULT_TEAM} scored: ${result.scoredRuns} runs`,
      `${GAME_CONSTANTS.PLAYERS.DEFAULT_TEAM} ${result.matchResult} by ${result.margin}`,
    ];
  }
}
