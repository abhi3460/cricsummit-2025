/**
 * Integration test for Challenge 1: Predict Outcome
 */

import { CricketApp } from '../src/app/cricket-app';

describe('Challenge1 Integration', () => {
  let cricketApp: CricketApp;

  beforeEach(() => {
    cricketApp = new CricketApp();
  });

  describe('Sample Input/Output', () => {
    test('should match expected sample output', () => {
      const sampleInput =
        'Bouncer Pull Perfect\nYorker Straight Early\nPace Straight Good';
      const expectedOutput = ['6 runs', '1 wicket', '3 runs'];

      const actualOutput = cricketApp.runChallenge1(sampleInput);

      expect(actualOutput).toEqual(expectedOutput);
    });

    test('should handle individual bowling scenarios', () => {
      const testCases = [
        {
          input: 'Bouncer Pull Perfect',
          expected: ['6 runs'],
        },
        {
          input: 'Yorker Straight Early',
          expected: ['1 wicket'],
        },
        {
          input: 'Pace Straight Good',
          expected: ['3 runs'],
        },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = cricketApp.runChallenge1(input);
        expect(result).toEqual(expected);
      });
    });

    test('should handle multi-word bowling types', () => {
      const testCases = [
        {
          input: 'Leg Cutter LegGlance Good',
          expected: ['2 runs'],
        },
        {
          input: 'Off Cutter SquareCut Perfect',
          expected: ['4 runs'],
        },
        {
          input: 'Slower Ball SquareCut Good',
          expected: ['3 runs'],
        },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = cricketApp.runChallenge1(input);
        expect(result).toEqual(expected);
      });
    });

    test('should handle multi-word shot types', () => {
      const testCases = [
        {
          input: 'Bouncer Long On Perfect',
          expected: ['2 runs'], // Default outcome as no specific rule
        },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = cricketApp.runChallenge1(input);
        expect(result).toEqual(expected);
      });
    });

    test('should handle multiple input lines', () => {
      const input = `Bouncer Pull Perfect
Yorker Straight Early
Pace Straight Good
Inswinger Flick Good
Outswinger CoverDrive Perfect`;

      const result = cricketApp.runChallenge1(input);

      expect(result).toHaveLength(5);
      expect(result[0]).toBe('6 runs');
      expect(result[1]).toBe('1 wicket');
      expect(result[2]).toBe('3 runs');
      expect(result[3]).toBe('3 runs');
      expect(result[4]).toBe('4 runs');
    });

    test('should handle empty lines in input', () => {
      const input = `Bouncer Pull Perfect

Yorker Straight Early
   
Pace Straight Good`;

      const result = cricketApp.runChallenge1(input);

      expect(result).toHaveLength(3);
      expect(result).toEqual(['6 runs', '1 wicket', '3 runs']);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid bowling type', () => {
      const input = 'InvalidBowling Pull Perfect';
      const result = cricketApp.runChallenge1(input);

      expect(result).toHaveLength(1);
      expect(result[0]).toContain('Invalid bowling type');
    });

    test('should handle invalid shot type', () => {
      const input = 'Bouncer InvalidShot Perfect';
      const result = cricketApp.runChallenge1(input);

      expect(result).toHaveLength(1);
      expect(result[0]).toContain('Invalid shot type');
    });

    test('should handle invalid timing', () => {
      const input = 'Bouncer Pull InvalidTiming';
      const result = cricketApp.runChallenge1(input);

      expect(result).toHaveLength(1);
      expect(result[0]).toContain('Invalid shot timing');
    });

    test('should handle malformed input', () => {
      const input = 'Bouncer';
      const result = cricketApp.runChallenge1(input);

      expect(result).toHaveLength(1);
      expect(result[0]).toContain('Invalid input format');
    });
  });

  describe('Strategy Management', () => {
    test('should use rule-based strategy by default', () => {
      expect(cricketApp.getCurrentStrategy()).toBe('rule-based');
    });

    test('should allow switching strategies', () => {
      cricketApp.setOutcomeStrategy('probabilistic');
      expect(cricketApp.getCurrentStrategy()).toBe('probabilistic');

      cricketApp.setOutcomeStrategy('rule-based');
      expect(cricketApp.getCurrentStrategy()).toBe('rule-based');
    });

    test('should return available strategies', () => {
      const strategies = cricketApp.getAvailableStrategies();
      expect(strategies).toContain('rule-based');
      expect(strategies).toContain('probabilistic');
    });
  });
});
