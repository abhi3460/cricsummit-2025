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
}

export interface SuperOverResult {
  targetRuns: number;
  scoredRuns: number;
  wicketsLost: number;
  ballsPlayed: number;
  matchResult: 'won' | 'lost';
  margin: string;
  balls: SuperOverBallResult[];
  errors?: string[]; // Optional errors for unrealistic combinations
}

export class SuperOverFormatter implements IOutputFormatter<SuperOverResult> {
  format(data: SuperOverResult): string {
    const lines: string[] = [];

    // Show errors at the top if any unrealistic combinations were detected
    if (data.errors && data.errors.length > 0) {
      lines.push('⚠️  Unrealistic Combinations Detected:');
      for (const error of data.errors) {
        lines.push(`   ${error}`);
      }
      lines.push(''); // Empty line
      lines.push(
        'Note: Bowling shots are random, so the match continues with the generated bowling cards.'
      );
      lines.push(''); // Empty line
    }

    // Show target score at the beginning
    lines.push(
      `${GAME_CONSTANTS.PLAYERS.DEFAULT_TEAM} needs ${data.targetRuns} runs to win`
    );
    lines.push(''); // Empty line

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

  formatMatchSummary(result: SuperOverResult): string[] {
    return [
      `${GAME_CONSTANTS.PLAYERS.DEFAULT_TEAM} scored: ${result.scoredRuns} runs`,
      `${GAME_CONSTANTS.PLAYERS.DEFAULT_TEAM} ${result.matchResult} by ${result.margin}`,
    ];
  }
}
