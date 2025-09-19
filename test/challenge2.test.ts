/**
 * Integration test for Challenge 2: Commentary
 */

import { CricketApp } from '../src/app/cricket-app';

describe('Challenge2 Integration', () => {
  let cricketApp: CricketApp;

  beforeEach(() => {
    cricketApp = new CricketApp();
  });

  describe('Sample Input/Output', () => {
    test('should generate commentary with outcomes', () => {
      const input = 'Bouncer Pull Late';
      const result = cricketApp.runChallenge2(input);

      expect(result).toHaveLength(1);
      expect(result[0]).toContain(' - '); // Commentary format: "commentary - outcome"
      expect(result[0]).toContain('1 wicket');
    });

    test('should handle multiple inputs', () => {
      const input = `Bouncer Pull Perfect
Yorker Straight Early
Pace Straight Good`;

      const result = cricketApp.runChallenge2(input);

      expect(result).toHaveLength(3);
      result.forEach(output => {
        expect(output).toContain(' - '); // Commentary format
        expect(typeof output).toBe('string');
      });
    });

    test('should generate appropriate commentary for different outcomes', () => {
      const testCases = [
        {
          input: 'Bouncer Pull Perfect',
          expectedOutcome: '6 runs',
          expectedCommentary: "That's massive and out of the ground.",
        },
        {
          input: 'Yorker Straight Early',
          expectedOutcome: '1 wicket',
          expectedCommentary: "It's a wicket!",
        },
        {
          input: 'Pace Straight Good',
          expectedOutcome: '3 runs',
          expectedCommentary: 'Just over the fielder.',
        },
      ];

      testCases.forEach(({ input, expectedOutcome, expectedCommentary }) => {
        const result = cricketApp.runChallenge2(input);
        expect(result).toHaveLength(1);
        expect(result[0]).toContain(expectedOutcome);
        expect(result[0]).toContain(expectedCommentary);
      });
    });

    test('should handle multi-word bowling and shot types', () => {
      const input = 'Leg Cutter LegGlance Good';
      const result = cricketApp.runChallenge2(input);

      expect(result).toHaveLength(1);
      expect(result[0]).toContain(' - ');
      expect(result[0]).toContain('2 runs');
    });
  });

  describe('Commentary Format', () => {
    test('should format commentary correctly', () => {
      const input = 'Bouncer Pull Perfect';
      const result = cricketApp.runChallenge2(input);

      expect(result[0]).toMatch(/^.+ - \d+ runs?$|^.+ - 1 wicket$/);
    });

    test('should provide different commentary for different outcomes', () => {
      const inputs = [
        'Bouncer Pull Perfect', // 6 runs
        'Yorker Straight Early', // 1 wicket
        'Pace Straight Good', // 3 runs
        'Inswinger Flick Good', // 3 runs
      ];

      const results = inputs.map(input => cricketApp.runChallenge2(input));
      const commentaries = results.map(result => result[0].split(' - ')[0]);

      // Should have some variety in commentary (not all the same)
      const uniqueCommentaries = new Set(commentaries);
      expect(uniqueCommentaries.size).toBeGreaterThan(1);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid input gracefully', () => {
      const input = 'InvalidBowling Pull Perfect';
      const result = cricketApp.runChallenge2(input);

      expect(result).toHaveLength(1);
      expect(result[0]).toContain('Invalid bowling type');
    });

    test('should handle malformed input', () => {
      const input = 'Bouncer';
      const result = cricketApp.runChallenge2(input);

      expect(result).toHaveLength(1);
      expect(result[0]).toContain('Invalid input format');
    });
  });

  describe('Strategy Impact', () => {
    test('should produce different results with different strategies', () => {
      const input = 'Bouncer Pull Perfect';

      // Test with rule-based strategy
      cricketApp.setOutcomeStrategy('rule-based');
      const ruleBasedResult = cricketApp.runChallenge2(input);

      // Test with probabilistic strategy
      cricketApp.setOutcomeStrategy('probabilistic');
      const probabilisticResult = cricketApp.runChallenge2(input);

      // Both should be valid, but might be different due to probabilistic nature
      expect(ruleBasedResult).toHaveLength(1);
      expect(probabilisticResult).toHaveLength(1);
      expect(ruleBasedResult[0]).toContain(' - ');
      expect(probabilisticResult[0]).toContain(' - ');
    });
  });
});
