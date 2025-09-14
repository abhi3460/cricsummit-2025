/**
 * Test suite for Challenge 1: Predict Outcome
 */

import { Challenge1 } from "../src/challenge1";

describe("Challenge1", () => {
  let challenge1: Challenge1;

  beforeEach(() => {
    challenge1 = new Challenge1();
  });

  describe("Sample Input/Output", () => {
    test("should match expected sample output", () => {
      const sampleInput = challenge1.getSampleInput();
      const expectedOutput = challenge1.getSampleOutput();
      const actualOutput = challenge1.processInput(sampleInput);

      expect(actualOutput).toEqual(expectedOutput);
    });

    test("should handle sample input line by line", () => {
      const sampleInput = [
        "Bouncer Pull Perfect",
        "Yorker Straight Early",
        "Pace Straight Good",
      ];

      const expectedOutput = ["6 runs", "1 wicket", "3 runs"];
      const actualOutput = challenge1.processInput(sampleInput);

      expect(actualOutput).toEqual(expectedOutput);
    });
  });

  describe("Individual Outcome Predictions", () => {
    test("should predict correct outcomes for bouncer-pull combinations", () => {
      const inputs = [
        "Bouncer Pull Early",
        "Bouncer Pull Good",
        "Bouncer Pull Perfect",
        "Bouncer Pull Late",
      ];

      const expectedOutputs = ["2 runs", "4 runs", "6 runs", "1 wicket"];
      const actualOutputs = challenge1.processInput(inputs);

      expect(actualOutputs).toEqual(expectedOutputs);
    });

    test("should predict correct outcomes for yorker-straight combinations", () => {
      const inputs = [
        "Yorker Straight Early",
        "Yorker Straight Good",
        "Yorker Straight Perfect",
        "Yorker Straight Late",
      ];

      const expectedOutputs = ["1 wicket", "2 runs", "4 runs", "1 wicket"];
      const actualOutputs = challenge1.processInput(inputs);

      expect(actualOutputs).toEqual(expectedOutputs);
    });

    test("should predict correct outcomes for pace-straight combinations", () => {
      const inputs = [
        "Pace Straight Early",
        "Pace Straight Good",
        "Pace Straight Perfect",
        "Pace Straight Late",
      ];

      const expectedOutputs = ["1 run", "3 runs", "4 runs", "2 runs"];
      const actualOutputs = challenge1.processInput(inputs);

      expect(actualOutputs).toEqual(expectedOutputs);
    });
  });

  describe("String Input Processing", () => {
    test("should handle multi-line string input", () => {
      const inputString = `Bouncer Pull Perfect
Yorker Straight Early
Pace Straight Good`;

      const expectedOutput = ["6 runs", "1 wicket", "3 runs"];
      const actualOutput = challenge1.processStringInput(inputString);

      expect(actualOutput).toEqual(expectedOutput);
    });

    test("should handle single line input", () => {
      const inputString = "Bouncer Pull Perfect";
      const expectedOutput = ["6 runs"];
      const actualOutput = challenge1.processStringInput(inputString);

      expect(actualOutput).toEqual(expectedOutput);
    });

    test("should handle empty lines in input", () => {
      const inputString = `Bouncer Pull Perfect

Yorker Straight Early
Pace Straight Good`;

      const expectedOutput = ["6 runs", "1 wicket", "3 runs"];
      const actualOutput = challenge1.processStringInput(inputString);

      expect(actualOutput).toEqual(expectedOutput);
    });
  });

  describe("Error Handling", () => {
    test("should throw error for invalid input format", () => {
      const invalidInputs = [
        "Bouncer Pull", // Missing timing
        "Bouncer", // Missing shot and timing
        "Bouncer Pull Perfect Extra", // Too many parts
        "", // Empty line
      ];

      invalidInputs.forEach((input) => {
        expect(() => {
          challenge1.processInput([input]);
        }).toThrow();
      });
    });
  });

  describe("Performance", () => {
    test("should handle large input efficiently", () => {
      const largeInput: string[] = [];
      for (let i = 0; i < 1000; i++) {
        largeInput.push("Bouncer Pull Perfect");
      }

      const startTime = Date.now();
      const results = challenge1.processInput(largeInput);
      const endTime = Date.now();

      expect(results).toHaveLength(1000);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in less than 100ms

      // All results should be the same for same input
      results.forEach((result) => {
        expect(result).toBe("6 runs");
      });
    });
  });
});
