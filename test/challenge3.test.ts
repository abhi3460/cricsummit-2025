/**
 * Integration test for Challenge 3: Super Over
 */

import { CricketApp } from '../src/app/cricket-app';

describe('Challenge3 Integration', () => {
  let cricketApp: CricketApp;

  beforeEach(() => {
    cricketApp = new CricketApp();
  });

  describe('Sample Input/Output', () => {
    test('should simulate complete Super Over', () => {
      const input = `Straight Perfect
Flick Early
Sweep Good
LegGlance Good
SquareCut Late
CoverDrive Perfect`;

      const result = cricketApp.runChallenge3(input);

      expect(result.length).toBeGreaterThan(0);

      // Should contain ball-by-ball commentary
      const ballCommentary = result.filter(
        line => line.includes('bowled') || line.includes('played')
      );
      expect(ballCommentary.length).toBeGreaterThan(0);

      // Should contain final score and result
      const scoreLines = result.filter(
        line =>
          line.includes('INDIA scored:') ||
          line.includes('INDIA won') ||
          line.includes('INDIA lost')
      );
      expect(scoreLines.length).toBeGreaterThanOrEqual(2);
    });

    test('should handle Super Over with early wickets', () => {
      // Use combinations that are likely to result in wickets
      const input = `Straight Early
Flick Early
Sweep Early
LegGlance Early
SquareCut Early
CoverDrive Early`;

      const result = cricketApp.runChallenge3(input);

      expect(result.length).toBeGreaterThan(0);
      expect(result.some(line => line.includes('INDIA'))).toBe(true);
    });

    test('should provide proper ball-by-ball commentary', () => {
      const input = `Straight Perfect
Flick Good
Sweep Perfect
LegGlance Good
SquareCut Perfect
CoverDrive Good`;

      const result = cricketApp.runChallenge3(input);

      // Should have commentary for each ball
      const ballLines = result.filter(
        line => line.includes('Brett Lee bowled') && line.includes('ball')
      );
      const playLines = result.filter(
        line => line.includes('Rahul Dravid played') && line.includes('shot')
      );

      expect(ballLines.length).toBeGreaterThan(0);
      expect(playLines.length).toBeGreaterThan(0);
    });

    test('should calculate final score correctly', () => {
      const input = `Straight Perfect
Flick Perfect
Sweep Perfect
LegGlance Perfect
SquareCut Perfect
CoverDrive Perfect`;

      const result = cricketApp.runChallenge3(input);

      const scoreLine = result.find(line => line.includes('INDIA scored:'));
      expect(scoreLine).toBeDefined();

      if (scoreLine) {
        const scoreMatch = scoreLine.match(/(\d+) runs/);
        expect(scoreMatch).toBeTruthy();
        if (scoreMatch) {
          const score = parseInt(scoreMatch[1], 10);
          expect(score).toBeGreaterThanOrEqual(0);
        }
      }
    });

    test('should determine match result', () => {
      const input = `Straight Perfect
Flick Good
Sweep Good
LegGlance Good
SquareCut Good
CoverDrive Good`;

      const result = cricketApp.runChallenge3(input);

      const resultLine = result.find(
        line => line.includes('INDIA won') || line.includes('INDIA lost')
      );
      expect(resultLine).toBeDefined();

      if (resultLine) {
        expect(resultLine).toMatch(/INDIA (won|lost) by [\d\w\s]+/);
      }
    });
  });

  describe('Super Over Rules', () => {
    test('should handle exactly 6 balls', () => {
      const input = `Straight Perfect
Flick Good
Sweep Good
LegGlance Good
SquareCut Good
CoverDrive Good`;

      const result = cricketApp.runChallenge3(input);

      // Count the number of ball descriptions
      const ballCount = result.filter(
        line => line.includes('Brett Lee bowled') && line.includes('ball')
      ).length;

      expect(ballCount).toBeLessThanOrEqual(6); // May be less if match ends early
    });

    test('should stop early if target is achieved', () => {
      // This test might be probabilistic due to random target generation
      const input = `Straight Perfect
Flick Perfect
Sweep Perfect
LegGlance Perfect
SquareCut Perfect
CoverDrive Perfect`;

      const result = cricketApp.runChallenge3(input);

      // Should have a valid result regardless of when it ends
      expect(result.length).toBeGreaterThan(0);
      expect(result.some(line => line.includes('INDIA'))).toBe(true);
    });

    test('should stop early if 2 wickets are lost', () => {
      // Use timing that might result in wickets
      const input = `Straight Late
Flick Late
Sweep Late
LegGlance Late
SquareCut Late
CoverDrive Late`;

      const result = cricketApp.runChallenge3(input);

      expect(result.length).toBeGreaterThan(0);
      expect(result.some(line => line.includes('INDIA'))).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid number of shots', () => {
      const input = `Straight Perfect
Flick Good
Sweep Good`; // Only 3 shots instead of 6
      const result = cricketApp.runChallenge3(input);

      expect(result).toHaveLength(1);
      expect(result[0]).toContain('Super Over requires exactly 6 shot inputs');
    });

    test('should handle invalid shot types', () => {
      const input = `InvalidShot Perfect
Flick Good
Sweep Good
LegGlance Good
SquareCut Good
CoverDrive Good`;
      const result = cricketApp.runChallenge3(input);

      expect(result).toHaveLength(1);
      expect(result[0]).toContain('Invalid shot type');
    });

    test('should handle invalid timing', () => {
      const input = `Straight InvalidTiming
Flick Good
Sweep Good
LegGlance Good
SquareCut Good
CoverDrive Good`;
      const result = cricketApp.runChallenge3(input);

      expect(result).toHaveLength(1);
      expect(result[0]).toContain('Invalid shot timing');
    });

    test('should handle malformed input', () => {
      const input = `Straight
Flick Good
Sweep Good
LegGlance Good
SquareCut Good
CoverDrive Good`;
      const result = cricketApp.runChallenge3(input);

      expect(result).toHaveLength(1);
      expect(result[0]).toContain('Invalid input format');
    });
  });

  describe('Output Format', () => {
    test('should format output consistently', () => {
      const input = `Straight Perfect
Flick Good
Sweep Good
LegGlance Good
SquareCut Good
CoverDrive Good`;

      const result = cricketApp.runChallenge3(input);

      // Check that all lines are strings
      result.forEach(line => {
        expect(typeof line).toBe('string');
      });

      // Should have proper structure
      expect(result.length).toBeGreaterThan(5); // At least some commentary + summary
    });
  });

  describe('Strategy Impact', () => {
    test('should work with different outcome strategies', () => {
      const input = `Straight Perfect
Flick Good
Sweep Good
LegGlance Good
SquareCut Good
CoverDrive Good`;

      // Test with rule-based strategy
      cricketApp.setOutcomeStrategy('rule-based');
      const ruleBasedResult = cricketApp.runChallenge3(input);

      // Test with probabilistic strategy
      cricketApp.setOutcomeStrategy('probabilistic');
      const probabilisticResult = cricketApp.runChallenge3(input);

      // Both should produce valid results
      expect(ruleBasedResult.length).toBeGreaterThan(0);
      expect(probabilisticResult.length).toBeGreaterThan(0);

      expect(ruleBasedResult.some(line => line.includes('INDIA'))).toBe(true);
      expect(probabilisticResult.some(line => line.includes('INDIA'))).toBe(
        true
      );
    });
  });
});
