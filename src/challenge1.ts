/**
 * Challenge #1: Predict Outcome
 *
 * Problem: Create an outcome chart and predict shot outcome for random bowl/shot combinations
 *
 * Time Complexity: O(n) where n is number of input lines
 * Space Complexity: O(1) for processing each line
 */

import {
  BowlingType,
  ShotType,
  ShotTiming,
  ShotOutcome,
  CricketInput,
} from "./types";
import { OutcomeEngine } from "./outcome-engine";

export class Challenge1 {
  private outcomeEngine: OutcomeEngine;

  constructor() {
    this.outcomeEngine = new OutcomeEngine();
  }

  /**
   * Parse input line to extract bowling type, shot type, and timing
   * Time Complexity: O(1) - Fixed string parsing
   *
   * @param line - Input line in format "bowl_card_name shot_card_name shot_timing"
   * @returns Parsed cricket input
   */
  private parseInputLine(line: string): CricketInput {
    const parts = line.trim().split(" ");

    if (parts.length !== 3) {
      throw new Error(
        `Invalid input format: ${line}. Expected: "bowl_card_name shot_card_name shot_timing"`
      );
    }

    const [bowlingType, shotType, timing] = parts;

    return {
      bowlingType: bowlingType as BowlingType,
      shotType: shotType as ShotType,
      shotTiming: timing as ShotTiming,
    };
  }

  /**
   * Process multiple input lines and predict outcomes
   * Time Complexity: O(n) where n is number of lines
   * Space Complexity: O(n) for storing results
   *
   * @param inputLines - Array of input lines
   * @returns Array of predicted outcomes
   */
  processInput(inputLines: string[]): ShotOutcome[] {
    const outcomes: ShotOutcome[] = [];

    for (const line of inputLines) {
      if (line.trim()) {
        // Skip empty lines
        const cricketInput = this.parseInputLine(line);
        const outcome = this.outcomeEngine.predictOutcome(
          cricketInput.bowlingType,
          cricketInput.shotType,
          cricketInput.shotTiming
        );
        outcomes.push(outcome);
      }
    }

    return outcomes;
  }

  /**
   * Process input from string (for console/file input)
   * Time Complexity: O(n) where n is number of lines
   *
   * @param input - Multi-line input string
   * @returns Array of predicted outcomes
   */
  processStringInput(input: string): ShotOutcome[] {
    const lines = input.trim().split("\n");
    return this.processInput(lines);
  }

  /**
   * Get sample input for testing
   */
  getSampleInput(): string[] {
    return [
      "Bouncer Pull Perfect",
      "Yorker Straight Early",
      "Pace Straight Good",
    ];
  }

  /**
   * Get expected sample output
   */
  getSampleOutput(): ShotOutcome[] {
    return ["6 runs", "1 wicket", "3 runs"];
  }
}
