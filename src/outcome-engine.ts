/**
 * Cricket Outcome Prediction Engine
 *
 * Time Complexity:
 * - Lookup: O(1) - Hash map based lookup
 * - Space Complexity: O(1) - Fixed number of combinations (10 * 10 * 4 = 400)
 *
 * This engine implements cricket outcome prediction based on bowling type,
 * shot type, and timing combinations.
 */

import {
  BowlingType,
  ShotType,
  ShotTiming,
  ShotOutcome,
  OutcomeRule,
} from "./types";

export class OutcomeEngine {
  private outcomeMap: Map<string, ShotOutcome> = new Map();

  constructor() {
    this.initializeOutcomeRules();
  }

  /**
   * Initialize outcome rules based on cricket strategy
   * Each bowling-shot combination has different outcomes based on timing
   */
  private initializeOutcomeRules(): void {
    const rules: OutcomeRule[] = [
      // Bouncer ball combinations
      {
        bowlingType: "Bouncer",
        shotType: "Pull",
        timingOutcomes: {
          Early: "2 runs",
          Good: "4 runs",
          Perfect: "6 runs",
          Late: "1 wicket",
        },
      },
      {
        bowlingType: "Bouncer",
        shotType: "UpperCut",
        timingOutcomes: {
          Early: "1 run",
          Good: "4 runs",
          Perfect: "6 runs",
          Late: "1 wicket",
        },
      },

      // Yorker combinations
      {
        bowlingType: "Yorker",
        shotType: "Straight",
        timingOutcomes: {
          Early: "1 wicket",
          Good: "2 runs",
          Perfect: "4 runs",
          Late: "1 wicket",
        },
      },

      // Pace ball combinations
      {
        bowlingType: "Pace",
        shotType: "Straight",
        timingOutcomes: {
          Early: "1 run",
          Good: "3 runs",
          Perfect: "4 runs",
          Late: "2 runs",
        },
      },

      // Off Break combinations
      {
        bowlingType: "Off Break",
        shotType: "Sweep",
        timingOutcomes: {
          Early: "1 wicket",
          Good: "2 runs",
          Perfect: "4 runs",
          Late: "1 wicket",
        },
      },

      // Inswinger combinations
      {
        bowlingType: "Inswinger",
        shotType: "Flick",
        timingOutcomes: {
          Early: "1 run",
          Good: "3 runs",
          Perfect: "4 runs",
          Late: "2 runs",
        },
      },

      // Outswinger combinations
      {
        bowlingType: "Outswinger",
        shotType: "CoverDrive",
        timingOutcomes: {
          Early: "1 run",
          Good: "2 runs",
          Perfect: "4 runs",
          Late: "1 wicket",
        },
      },

      // Slower Ball combinations
      {
        bowlingType: "Slower Ball",
        shotType: "SquareCut",
        timingOutcomes: {
          Early: "1 wicket",
          Good: "3 runs",
          Perfect: "4 runs",
          Late: "2 runs",
        },
      },

      // Leg Cutter combinations
      {
        bowlingType: "Leg Cutter",
        shotType: "LegLance",
        timingOutcomes: {
          Early: "1 run",
          Good: "2 runs",
          Perfect: "3 runs",
          Late: "1 wicket",
        },
      },

      // Doosra combinations
      {
        bowlingType: "Doosra",
        shotType: "Scoop",
        timingOutcomes: {
          Early: "1 wicket",
          Good: "4 runs",
          Perfect: "6 runs",
          Late: "1 wicket",
        },
      },
    ];

    // Populate outcome map for O(1) lookup
    rules.forEach((rule) => {
      Object.entries(rule.timingOutcomes).forEach(([timing, outcome]) => {
        const key = this.generateKey(
          rule.bowlingType,
          rule.shotType,
          timing as ShotTiming
        );
        this.outcomeMap.set(key, outcome);
      });
    });
  }

  /**
   * Generate a unique key for bowling-shot-timing combination
   * Time Complexity: O(1)
   */
  private generateKey(
    bowlingType: BowlingType,
    shotType: ShotType,
    timing: ShotTiming
  ): string {
    return `${bowlingType}|${shotType}|${timing}`;
  }

  /**
   * Predict outcome based on bowling type, shot type, and timing
   * Time Complexity: O(1) - Hash map lookup
   * Space Complexity: O(1)
   *
   * @param bowlingType - Type of delivery bowled
   * @param shotType - Type of shot played
   * @param timing - Timing of the shot
   * @returns Predicted outcome
   */
  predictOutcome(
    bowlingType: BowlingType,
    shotType: ShotType,
    timing: ShotTiming
  ): ShotOutcome {
    const key = this.generateKey(bowlingType, shotType, timing);
    const outcome = this.outcomeMap.get(key);

    if (!outcome) {
      // Default outcome for unhandled combinations
      return "2 runs";
    }

    return outcome;
  }

  /**
   * Get all possible combinations count
   * Time Complexity: O(1)
   */
  getTotalCombinations(): number {
    return this.outcomeMap.size;
  }
}
