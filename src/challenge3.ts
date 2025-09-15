/**
 * Challenge #3: Super Over
 *
 * Problem: Predict match outcome for super over and print bowl-by-bowl commentary
 *
 * Super Over Rules:
 * - 6 balls, 2 wickets available
 * - Target runs to chase
 * - Bowl-by-bowl commentary with match result
 *
 * Time Complexity: O(n) where n = 6 balls (fixed)
 * Space Complexity: O(1) - fixed number of balls
 */

import { BowlingType, ShotType, ShotTiming, ShotOutcome } from "./types";
import { OutcomeEngine } from "./outcome-engine";
import { CommentaryEngine } from "./commentary-engine";

export interface SuperOverBall {
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
  matchResult: "won" | "lost";
  margin: string;
  balls: SuperOverBall[];
}

export class Challenge3 {
  private outcomeEngine: OutcomeEngine;
  private commentaryEngine: CommentaryEngine;
  private bowlerName: string = "Sudhakar";
  private batsmanName: string = "Craig";

  // Predefined bowling cards for Super Over
  private bowlingCards: BowlingType[] = [
    "Bouncer",
    "Inswinger",
    "Outswinger",
    "Leg Cutter",
    "Off Cutter",
    "Slower Ball",
    "Yorker",
    "Pace",
    "Off Break",
    "Doosra",
  ];

  constructor() {
    this.outcomeEngine = new OutcomeEngine();
    this.commentaryEngine = new CommentaryEngine();
  }

  /**
   * Parse input line for Super Over (shot_name shot_timing)
   * Time Complexity: O(1)
   *
   * @param line - Input line in format "shot_name shot_timing"
   * @returns Parsed shot input
   */
  private parseShotInput(line: string): {
    shotType: ShotType;
    timing: ShotTiming;
  } {
    const parts = line.trim().split(" ");

    if (parts.length !== 2) {
      throw new Error(
        `Invalid input format: ${line}. Expected: "shot_name shot_timing"`
      );
    }

    const [shotType, timing] = parts;

    return {
      shotType: shotType as ShotType,
      timing: timing as ShotTiming,
    };
  }

  /**
   * Generate random target runs (realistic Super Over target)
   * Time Complexity: O(1)
   */
  private generateTargetRuns(): number {
    // Super Over targets typically range from 8-20 runs
    return Math.floor(Math.random() * 13) + 8; // 8-20 runs
  }

  /**
   * Process a single ball in the Super Over
   * Time Complexity: O(1)
   *
   * @param ballNumber - Ball number (1-6)
   * @param shotInput - Shot input string
   * @returns Ball result with commentary
   */
  private processBall(ballNumber: number, shotInput: string): SuperOverBall {
    const { shotType, timing } = this.parseShotInput(shotInput);
    const bowlingType = this.bowlingCards[ballNumber - 1]; // Use predefined bowling cards

    const outcome = this.outcomeEngine.predictOutcome(
      bowlingType,
      shotType,
      timing
    );
    const commentaryType = this.commentaryEngine.getCommentary(outcome);
    const commentary = this.commentaryEngine.formatCommentary(commentaryType);

    return {
      ballNumber,
      bowlingType,
      shotType,
      shotTiming: timing,
      outcome,
      commentary,
    };
  }

  /**
   * Calculate runs from outcome string
   * Time Complexity: O(1)
   */
  private extractRunsFromOutcome(outcome: ShotOutcome): number {
    if (outcome === "1 wicket") return 0;

    const runsMatch = outcome.match(/(\d+)\s+runs?/);
    return runsMatch ? parseInt(runsMatch[1]) : 0;
  }

  /**
   * Process complete Super Over
   * Time Complexity: O(6) = O(1) - fixed 6 balls
   * Space Complexity: O(1) - fixed number of balls
   *
   * @param shotInputs - Array of 6 shot inputs
   * @returns Complete Super Over result
   */
  processSuperOver(shotInputs: string[]): SuperOverResult {
    if (shotInputs.length !== 6) {
      throw new Error("Super Over requires exactly 6 ball inputs");
    }

    const targetRuns = this.generateTargetRuns();
    const balls: SuperOverBall[] = [];
    let scoredRuns = 0;
    let wicketsLost = 0;
    let ballsPlayed = 0;

    // Process each ball
    for (let i = 0; i < 6 && wicketsLost < 2; i++) {
      const ball = this.processBall(i + 1, shotInputs[i]);
      balls.push(ball);
      ballsPlayed++;

      // Extract runs and wickets
      const runs = this.extractRunsFromOutcome(ball.outcome);
      scoredRuns += runs;

      if (ball.outcome === "1 wicket") {
        wicketsLost++;
      }

      // Check if target is achieved
      if (scoredRuns >= targetRuns && wicketsLost < 2) {
        break; // Match won, no need to continue
      }
    }

    // Determine match result
    const matchResult: "won" | "lost" =
      scoredRuns >= targetRuns && wicketsLost < 2 ? "won" : "lost";

    let margin: string;
    if (matchResult === "won") {
      if (wicketsLost === 0) {
        margin = `${ballsPlayed} balls`;
      } else {
        margin = `${2 - wicketsLost} wickets`;
      }
    } else {
      margin = `${targetRuns - scoredRuns} runs`;
    }

    return {
      targetRuns,
      scoredRuns,
      wicketsLost,
      ballsPlayed,
      matchResult,
      margin,
      balls,
    };
  }

  /**
   * Format Super Over output for display
   * Time Complexity: O(6) = O(1)
   *
   * @param result - Super Over result
   * @returns Formatted output strings
   */
  formatOutput(result: SuperOverResult): string[] {
    const output: string[] = [];

    // Bowl-by-bowl commentary
    result.balls.forEach((ball) => {
      output.push(`${this.bowlerName} bowled ${ball.bowlingType} ball,`);
      output.push(
        `${this.batsmanName} played ${ball.shotTiming} ${ball.shotType} shot`
      );
      output.push(`${ball.commentary} - ${ball.outcome}`);
      output.push(""); // Empty line for readability
    });

    // Match summary
    output.push(`AUSTRALIA scored: ${result.scoredRuns} runs`);
    output.push(`AUSTRALIA ${result.matchResult} by ${result.margin}`);

    return output;
  }

  /**
   * Get sample input for Super Over
   */
  getSampleInput(): string[] {
    return [
      "Straight Perfect",
      "Flick Early",
      "Hook Good",
      "LegLance Good",
      "LongOff Late",
      "LongOn Perfect",
    ];
  }

  /**
   * Process input from string (for console/file input)
   * Time Complexity: O(6) = O(1)
   *
   * @param input - Multi-line input string with 6 shots
   * @returns Formatted output strings
   */
  processStringInput(input: string): string[] {
    const lines = input
      .trim()
      .split("\n")
      .filter((line) => line.trim());

    if (lines.length !== 6) {
      throw new Error("Super Over requires exactly 6 shot inputs");
    }

    const result = this.processSuperOver(lines);
    return this.formatOutput(result);
  }
}
