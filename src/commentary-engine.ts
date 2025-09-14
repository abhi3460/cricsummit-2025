/**
 * Cricket Commentary Engine
 *
 * Time Complexity:
 * - Lookup: O(1) - Direct mapping based on outcome
 * - Space Complexity: O(1) - Fixed number of commentary mappings
 *
 * This engine generates appropriate commentary based on shot outcomes.
 */

import { ShotOutcome, CommentaryType } from "./types";

export class CommentaryEngine {
  private commentaryMap: Map<ShotOutcome, CommentaryType> = new Map();

  constructor() {
    this.initializeCommentaryRules();
  }

  /**
   * Initialize commentary rules based on outcomes
   */
  private initializeCommentaryRules(): void {
    // Map outcomes to appropriate commentary
    this.commentaryMap.set("1 wicket", "wicket");
    this.commentaryMap.set("1 run", "convert-ones-twos");
    this.commentaryMap.set("2 runs", "excellent-running");
    this.commentaryMap.set("3 runs", "just-over-fielder");
    this.commentaryMap.set("4 runs", "excellent-line-length");
    this.commentaryMap.set("5 runs", "excellent-boundary-effort");
    this.commentaryMap.set("6 runs", "massive-out-ground");
  }

  /**
   * Get commentary based on shot outcome
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * @param outcome - The shot outcome
   * @returns Appropriate commentary type
   */
  getCommentary(outcome: ShotOutcome): CommentaryType {
    return this.commentaryMap.get(outcome) || "excellent-line-length";
  }

  /**
   * Format commentary for display
   * Time Complexity: O(1)
   *
   * @param commentaryType - Type of commentary
   * @returns Formatted commentary string
   */
  formatCommentary(commentaryType: CommentaryType): string {
    const commentaryText: Record<CommentaryType, string> = {
      wicket: "It's a wicket.",
      "excellent-line-length": "Excellent line and length.",
      "edged-taken": "Edged and taken.",
      "huge-hit": "It's a huge hit.",
      "just-over-fielder": "Just over the fielder.",
      "excellent-boundary-effort": "Excellent effort on the boundary.",
      "convert-ones-twos": "Convert ones into twos.",
      "massive-out-ground": "That's massive and out of the ground.",
      "excellent-running": "Excellent running between the wickets.",
    };

    return commentaryText[commentaryType];
  }
}
