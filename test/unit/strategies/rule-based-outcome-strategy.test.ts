/**
 * Unit Tests for Rule-Based Outcome Strategy
 */

import { RuleBasedOutcomeStrategy } from '../../../src/strategies/rule-based-outcome-strategy';
import { BowlingType, ShotType, ShotTiming } from '../../../src/types';

describe('RuleBasedOutcomeStrategy', () => {
  let strategy: RuleBasedOutcomeStrategy;

  beforeEach(() => {
    strategy = new RuleBasedOutcomeStrategy();
  });

  describe('predictOutcome', () => {
    it('should predict correct outcome for Bouncer + Pull + Perfect', () => {
      const outcome = strategy.predictOutcome('Bouncer', 'Pull', 'Perfect');
      expect(outcome).toBe('6 runs');
    });

    it('should predict correct outcome for Bouncer + Pull + Late', () => {
      const outcome = strategy.predictOutcome('Bouncer', 'Pull', 'Late');
      expect(outcome).toBe('1 wicket');
    });

    it('should predict correct outcome for Yorker + Straight + Early', () => {
      const outcome = strategy.predictOutcome('Yorker', 'Straight', 'Early');
      expect(outcome).toBe('1 wicket');
    });

    it('should predict correct outcome for Pace + Straight + Good', () => {
      const outcome = strategy.predictOutcome('Pace', 'Straight', 'Good');
      expect(outcome).toBe('3 runs');
    });

    it('should return default outcome for unknown combination', () => {
      // This should return default outcome since there's no rule for this combination
      const outcome = strategy.predictOutcome('Doosra', 'Sweep', 'Perfect');
      expect(outcome).toBe('2 runs'); // DEFAULT_OUTCOME
    });

    it('should handle all timing variations consistently', () => {
      const timings: ShotTiming[] = ['Early', 'Good', 'Perfect', 'Late'];

      timings.forEach(timing => {
        const outcome = strategy.predictOutcome('Bouncer', 'Pull', timing);
        expect(outcome).toBeDefined();
        expect(typeof outcome).toBe('string');
      });
    });
  });

  describe('getName', () => {
    it('should return correct strategy name', () => {
      expect(strategy.getName()).toBe('Rule-Based Strategy');
    });
  });

  describe('getDescription', () => {
    it('should return meaningful description', () => {
      const description = strategy.getDescription();
      expect(description).toContain('predefined rules');
      expect(description).toContain('configuration');
    });
  });

  describe('isValidCombination', () => {
    it('should return true for valid combinations', () => {
      expect(strategy.isValidCombination('Bouncer', 'Pull')).toBe(true);
      expect(strategy.isValidCombination('Yorker', 'Straight')).toBe(true);
      expect(strategy.isValidCombination('Pace', 'Straight')).toBe(true);
    });

    it('should return false for invalid combinations', () => {
      expect(strategy.isValidCombination('Doosra', 'Sweep')).toBe(false);
      expect(strategy.isValidCombination('Yorker', 'Pull')).toBe(false);
    });
  });

  describe('getTotalRules', () => {
    it('should return positive number of rules', () => {
      const totalRules = strategy.getTotalRules();
      expect(totalRules).toBeGreaterThan(0);
      expect(typeof totalRules).toBe('number');
    });
  });

  describe('getAvailableCombinations', () => {
    it('should return non-empty array of combinations', () => {
      const combinations = strategy.getAvailableCombinations();
      expect(combinations.length).toBeGreaterThan(0);
      expect(combinations[0]).toContain('|'); // Should be in format "bowling|shot|timing"
    });

    it('should contain expected combination format', () => {
      const combinations = strategy.getAvailableCombinations();
      const sampleCombination = combinations[0];
      const parts = sampleCombination.split('|');
      expect(parts).toHaveLength(3); // bowling|shot|timing
    });
  });

  describe('consistency', () => {
    it('should always return same outcome for same input', () => {
      const bowling: BowlingType = 'Bouncer';
      const shot: ShotType = 'Pull';
      const timing: ShotTiming = 'Perfect';

      const outcome1 = strategy.predictOutcome(bowling, shot, timing);
      const outcome2 = strategy.predictOutcome(bowling, shot, timing);
      const outcome3 = strategy.predictOutcome(bowling, shot, timing);

      expect(outcome1).toBe(outcome2);
      expect(outcome2).toBe(outcome3);
    });

    it('should maintain rule consistency across multiple calls', () => {
      const testCases = [
        {
          bowling: 'Bouncer' as BowlingType,
          shot: 'Pull' as ShotType,
          timing: 'Perfect' as ShotTiming,
        },
        {
          bowling: 'Yorker' as BowlingType,
          shot: 'Straight' as ShotType,
          timing: 'Early' as ShotTiming,
        },
        {
          bowling: 'Pace' as BowlingType,
          shot: 'Straight' as ShotType,
          timing: 'Good' as ShotTiming,
        },
      ];

      testCases.forEach(testCase => {
        const outcome1 = strategy.predictOutcome(
          testCase.bowling,
          testCase.shot,
          testCase.timing
        );
        const outcome2 = strategy.predictOutcome(
          testCase.bowling,
          testCase.shot,
          testCase.timing
        );
        expect(outcome1).toBe(outcome2);
      });
    });
  });
});
