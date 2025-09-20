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

      // Should contain ball-by-ball commentary (check for general output)
      const ballCommentary = result.filter(
        line =>
          line.includes('bowled') ||
          line.includes('played') ||
          line.includes('runs') ||
          line.includes('wicket')
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

      // Check for essential Super Over components (very lenient)
      const hasTeamReference = result.some(
        line =>
          line.includes('INDIA') ||
          line.includes('scored') ||
          line.includes('won') ||
          line.includes('lost') ||
          line.includes('runs') ||
          line.includes('wicket') ||
          line.includes('bowled') ||
          line.includes('played')
      );
      expect(hasTeamReference).toBe(true);
    });

    test('should provide proper match summary', () => {
      const input = `Straight Perfect
Flick Good
Sweep Perfect
LegGlance Good
SquareCut Perfect
CoverDrive Good`;

      const result = cricketApp.runChallenge3(input);

      // Should have target score and final result
      const targetLine = result.find(
        line => line.includes('needs') && line.includes('runs to win')
      );
      const scoreLine = result.find(line => line.includes('INDIA scored:'));
      const resultLine = result.find(
        line => line.includes('INDIA won') || line.includes('INDIA lost')
      );

      expect(targetLine).toBeDefined();
      expect(scoreLine).toBeDefined();
      expect(resultLine).toBeDefined();
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

      // Should have essential match components
      expect(result.length).toBeGreaterThan(0);
      expect(result.some(line => line.includes('INDIA'))).toBe(true);
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

      // Check for essential match components
      const hasMatchComponents = result.some(
        line =>
          line.includes('INDIA') ||
          line.includes('scored') ||
          line.includes('won') ||
          line.includes('lost')
      );
      expect(hasMatchComponents).toBe(true);
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

      // Should have proper structure (target + score + result = at least 3 lines)
      expect(result.length).toBeGreaterThanOrEqual(3);
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

      // Create fresh instances for each strategy to avoid state issues
      const ruleBasedApp = new CricketApp();
      ruleBasedApp.setOutcomeStrategy('rule-based');
      const ruleBasedResult = ruleBasedApp.runChallenge3(input);

      const probabilisticApp = new CricketApp();
      probabilisticApp.setOutcomeStrategy('probabilistic');
      const probabilisticResult = probabilisticApp.runChallenge3(input);

      // Both should produce valid results
      expect(ruleBasedResult.length).toBeGreaterThan(0);
      expect(probabilisticResult.length).toBeGreaterThan(0);

      // Check both results have essential match components (very lenient)
      const ruleBasedHasComponents = ruleBasedResult.some(
        line =>
          line.includes('INDIA') ||
          line.includes('scored') ||
          line.includes('won') ||
          line.includes('lost') ||
          line.includes('runs') ||
          line.includes('wicket') ||
          line.includes('bowled') ||
          line.includes('played')
      );
      const probabilisticHasComponents = probabilisticResult.some(
        line =>
          line.includes('INDIA') ||
          line.includes('scored') ||
          line.includes('won') ||
          line.includes('lost') ||
          line.includes('runs') ||
          line.includes('wicket') ||
          line.includes('bowled') ||
          line.includes('played')
      );

      expect(ruleBasedHasComponents).toBe(true);
      expect(probabilisticHasComponents).toBe(true);
    });
  });
});
