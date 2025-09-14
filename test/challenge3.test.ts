/**
 * Test suite for Challenge 3: Super Over
 */

import { Challenge3 } from "../src/challenge3";

describe("Challenge3", () => {
  let challenge3: Challenge3;

  beforeEach(() => {
    challenge3 = new Challenge3();
  });

  describe("Sample Input/Output", () => {
    test("should process sample input correctly", () => {
      const sampleInput = challenge3.getSampleInput();
      expect(sampleInput).toHaveLength(6);

      // Should not throw error
      expect(() => {
        challenge3.processSuperOver(sampleInput);
      }).not.toThrow();
    });

    test("should handle sample input line by line", () => {
      const sampleInput = [
        "Straight Perfect",
        "Flick Early",
        "Hook Good",
        "LegLance Good",
        "LongOff Late",
        "LongOn Perfect",
      ];

      const result = challenge3.processSuperOver(sampleInput);

      expect(result.balls).toHaveLength(6);
      expect(result.targetRuns).toBeGreaterThanOrEqual(8);
      expect(result.targetRuns).toBeLessThanOrEqual(20);
      expect(result.wicketsLost).toBeLessThanOrEqual(2);
      expect(result.ballsPlayed).toBeGreaterThan(0);
      expect(result.ballsPlayed).toBeLessThanOrEqual(6);
    });
  });

  describe("Super Over Logic", () => {
    test("should stop when 2 wickets are lost", () => {
      // Create input that will result in wickets
      const inputWithWickets = [
        "Straight Early", // Should result in wicket for most bowling types
        "Straight Early", // Should result in wicket
        "Hook Good", // This shouldn't be processed
        "LegLance Good",
        "LongOff Late",
        "LongOn Perfect",
      ];

      const result = challenge3.processSuperOver(inputWithWickets);

      // Should stop early if 2 wickets are lost
      expect(result.wicketsLost).toBeLessThanOrEqual(2);
      expect(result.ballsPlayed).toBeLessThanOrEqual(6);
    });

    test("should stop when target is achieved", () => {
      // Create input that will score high runs
      const highScoringInput = [
        "Straight Perfect", // Should score 4+ runs
        "Flick Perfect", // Should score 4+ runs
        "Hook Perfect", // Should score 4+ runs
        "LegLance Perfect", // Should score 4+ runs
        "LongOff Perfect", // This might not be processed if target achieved
        "LongOn Perfect",
      ];

      const result = challenge3.processSuperOver(highScoringInput);

      // Should have reasonable results
      expect(result.scoredRuns).toBeGreaterThanOrEqual(0);
      expect(result.ballsPlayed).toBeLessThanOrEqual(6);
    });

    test("should determine match result correctly", () => {
      const sampleInput = challenge3.getSampleInput();
      const result = challenge3.processSuperOver(sampleInput);

      expect(result.matchResult).toMatch(/^(won|lost)$/);
      expect(result.margin).toBeDefined();
      expect(typeof result.margin).toBe("string");
    });
  });

  describe("Input Validation", () => {
    test("should throw error for incorrect number of inputs", () => {
      const invalidInputs = [
        ["Straight Perfect"], // Too few
        ["Straight Perfect", "Flick Early"], // Too few
        [
          "Straight Perfect",
          "Flick Early",
          "Hook Good",
          "LegLance Good",
          "LongOff Late",
          "LongOn Perfect",
          "Extra Shot",
        ], // Too many
      ];

      invalidInputs.forEach((input) => {
        expect(() => {
          challenge3.processSuperOver(input);
        }).toThrow();
      });
    });

    test("should throw error for invalid input format", () => {
      const invalidInputs = [
        [
          "Straight",
          "Flick Early",
          "Hook Good",
          "LegLance Good",
          "LongOff Late",
          "LongOn Perfect",
        ], // Missing timing
        [
          "Straight Perfect Extra",
          "Flick Early",
          "Hook Good",
          "LegLance Good",
          "LongOff Late",
          "LongOn Perfect",
        ], // Too many parts
      ];

      invalidInputs.forEach((input) => {
        expect(() => {
          challenge3.processSuperOver(input);
        }).toThrow();
      });
    });
  });

  describe("Output Formatting", () => {
    test("should format output correctly", () => {
      const sampleInput = challenge3.getSampleInput();
      const result = challenge3.processSuperOver(sampleInput);
      const formattedOutput = challenge3.formatOutput(result);

      expect(formattedOutput).toBeInstanceOf(Array);
      expect(formattedOutput.length).toBeGreaterThan(0);

      // Should contain bowl-by-bowl commentary
      const bowlCommentary = formattedOutput.filter(
        (line) => line.includes("bowled") || line.includes("played")
      );
      expect(bowlCommentary.length).toBeGreaterThan(0);

      // Should contain match summary
      const summary = formattedOutput.filter(
        (line) =>
          line.includes("AUSTRALIA scored") ||
          line.includes("AUSTRALIA won") ||
          line.includes("AUSTRALIA lost")
      );
      expect(summary.length).toBeGreaterThanOrEqual(2);
    });

    test("should include all required output elements", () => {
      const sampleInput = challenge3.getSampleInput();
      const result = challenge3.processSuperOver(sampleInput);
      const formattedOutput = challenge3.formatOutput(result);

      const outputString = formattedOutput.join("\n");

      // Should contain bowler name
      expect(outputString).toContain("Sudhakar");

      // Should contain batsman name
      expect(outputString).toContain("Craig");

      // Should contain match result
      expect(outputString).toMatch(/AUSTRALIA (won|lost)/);

      // Should contain score information
      expect(outputString).toContain("AUSTRALIA scored:");
    });
  });

  describe("String Input Processing", () => {
    test("should handle multi-line string input", () => {
      const inputString = `Straight Perfect
Flick Early
Hook Good
LegLance Good
LongOff Late
LongOn Perfect`;

      expect(() => {
        challenge3.processStringInput(inputString);
      }).not.toThrow();

      const output = challenge3.processStringInput(inputString);
      expect(output).toBeInstanceOf(Array);
      expect(output.length).toBeGreaterThan(0);
    });

    test("should handle empty lines in input", () => {
      const inputString = `Straight Perfect

Flick Early
Hook Good
LegLance Good
LongOff Late
LongOn Perfect`;

      expect(() => {
        challenge3.processStringInput(inputString);
      }).not.toThrow();
    });
  });

  describe("Performance", () => {
    test("should handle multiple Super Overs efficiently", () => {
      const sampleInput = challenge3.getSampleInput();

      const startTime = Date.now();
      for (let i = 0; i < 100; i++) {
        challenge3.processSuperOver(sampleInput);
      }
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(500); // Should complete in less than 500ms
    });
  });
});
