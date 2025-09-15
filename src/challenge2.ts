/**
 * Challenge #2: Commentary
 *
 * Problem: Generate commentary based on cricket outcomes
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
import { CommentaryEngine } from "./commentary-engine";

export interface CommentaryOutput {
  commentary: string;
  outcome: ShotOutcome;
}

export class Challenge2 {
  private outcomeEngine: OutcomeEngine;
  private commentaryEngine: CommentaryEngine;

  constructor() {
    this.outcomeEngine = new OutcomeEngine();
    this.commentaryEngine = new CommentaryEngine();
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
   * Generate commentary and outcome for a single input
   * Time Complexity: O(1) - Fixed lookup operations
   * Space Complexity: O(1)
   *
   * @param cricketInput - Parsed cricket input
   * @returns Commentary output with commentary and outcome
   */
  generateCommentary(cricketInput: CricketInput): CommentaryOutput {
    // Predict outcome using Challenge 1 logic
    const outcome = this.outcomeEngine.predictOutcome(
      cricketInput.bowlingType,
      cricketInput.shotType,
      cricketInput.shotTiming
    );

    // Get appropriate commentary
    const commentaryType = this.commentaryEngine.getCommentary(outcome);
    const commentary = this.commentaryEngine.formatCommentary(commentaryType);

    return {
      commentary,
      outcome,
    };
  }

  /**
   * Process multiple input lines and generate commentary
   * Time Complexity: O(n) where n is number of lines
   * Space Complexity: O(n) for storing results
   *
   * @param inputLines - Array of input lines
   * @returns Array of commentary outputs
   */
  processInput(inputLines: string[]): CommentaryOutput[] {
    const outputs: CommentaryOutput[] = [];

    for (const line of inputLines) {
      if (line.trim()) {
        // Skip empty lines
        const cricketInput = this.parseInputLine(line);
        const output = this.generateCommentary(cricketInput);
        outputs.push(output);
      }
    }

    return outputs;
  }

  /**
   * Process input from string (for console/file input)
   * Time Complexity: O(n) where n is number of lines
   *
   * @param input - Multi-line input string
   * @returns Array of commentary outputs
   */
  processStringInput(input: string): CommentaryOutput[] {
    const lines = input.trim().split("\n");
    return this.processInput(lines);
  }

  /**
   * Format output for display
   * Time Complexity: O(n) where n is number of outputs
   *
   * @param outputs - Array of commentary outputs
   * @returns Formatted string output
   */
  formatOutput(outputs: CommentaryOutput[]): string {
    return outputs
      .map((output) => `${output.commentary} - ${output.outcome}`)
      .join("\n");
  }

  /**
   * Get sample input for testing
   */
  getSampleInput(): string[] {
    return ["Bouncer Pull Late"];
  }

  /**
   * Get expected sample output
   */
  getSampleOutput(): CommentaryOutput[] {
    return [
      {
        commentary: "It's a wicket.",
        outcome: "1 wicket",
      },
    ];
  }
}
