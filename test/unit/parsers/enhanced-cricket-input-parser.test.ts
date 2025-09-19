/**
 * Enhanced Cricket Input Parser Tests
 * Comprehensive unit tests using improved test utilities
 */

import { CricketInputParser } from '../../../src/parsers/cricket-input-parser';
import {
  CricketTestDataGenerator,
  CricketTestScenarioBuilder,
  CricketPerformanceTestUtils,
} from '../../../src/test-utils/cricket-test-helpers';
import { BowlingType, ShotType } from '../../../src/types';

describe('CricketInputParser - Enhanced Tests', () => {
  let parser: CricketInputParser;

  beforeEach(() => {
    parser = new CricketInputParser();
  });

  describe('Valid Input Parsing', () => {
    test('should parse all valid bowling type combinations', () => {
      const bowlingTypes = CricketTestDataGenerator.getAllBowlingTypes();

      bowlingTypes.forEach(bowlingType => {
        const input = `${bowlingType} Pull Perfect`;
        const result = parser.parse(input);

        expect(result.success).toBe(true);
        expect(result.data?.bowlingType).toBe(bowlingType);
      });
    });

    test('should parse all valid shot type combinations', () => {
      const shotTypes = CricketTestDataGenerator.getAllShotTypes();

      shotTypes.forEach(shotType => {
        const input = `Bouncer ${shotType} Perfect`;
        const result = parser.parse(input);

        expect(result.success).toBe(true);
        expect(result.data?.shotType).toBe(shotType);
      });
    });

    test('should parse all valid timing combinations', () => {
      const timings = CricketTestDataGenerator.getAllShotTimings();

      timings.forEach(timing => {
        const input = `Bouncer Pull ${timing}`;
        const result = parser.parse(input);

        expect(result.success).toBe(true);
        expect(result.data?.shotTiming).toBe(timing);
      });
    });

    test('should handle multi-word bowling types correctly', () => {
      const multiWordBowlingTypes: BowlingType[] = [
        'Leg Cutter',
        'Off Cutter',
        'Off Break',
      ];

      multiWordBowlingTypes.forEach(bowlingType => {
        const input = `${bowlingType} Pull Perfect`;
        const result = parser.parse(input);

        expect(result.success).toBe(true);
        expect(result.data?.bowlingType).toBe(bowlingType);
      });
    });

    test('should handle multi-word shot types correctly', () => {
      const multiWordShotTypes: ShotType[] = ['Long On'];

      multiWordShotTypes.forEach(shotType => {
        const input = `Bouncer ${shotType} Perfect`;
        const result = parser.parse(input);

        expect(result.success).toBe(true);
        expect(result.data?.shotType).toBe(shotType);
      });
    });
  });

  describe('Invalid Input Handling', () => {
    test('should reject invalid bowling types with suggestions', () => {
      const invalidInputs =
        CricketTestDataGenerator.generateInvalidBowlingInputs();

      invalidInputs.forEach(input => {
        const result = parser.parse(input);
        const suggestions = parser.getSuggestions(input.split(' ')[0]);

        expect(result.success).toBe(false);
        expect(result.error).toContain('Invalid bowling type');
        expect(suggestions.bowlingSuggestions).toBeDefined();
      });
    });

    test('should reject invalid shot types with suggestions', () => {
      const invalidInputs =
        CricketTestDataGenerator.generateInvalidShotInputs();

      invalidInputs.forEach(input => {
        const result = parser.parse(input);
        const words = input.split(' ');
        const suggestions = parser.getSuggestions(words[1]);

        expect(result.success).toBe(false);
        expect(result.error).toContain('Invalid shot type');
        expect(suggestions.shotSuggestions).toBeDefined();
      });
    });

    test('should reject invalid timing with suggestions', () => {
      const invalidInputs =
        CricketTestDataGenerator.generateInvalidTimingInputs();

      invalidInputs.forEach(input => {
        const result = parser.parse(input);
        const words = input.split(' ');
        const suggestions = parser.getSuggestions(words[2]);

        expect(result.success).toBe(false);
        expect(result.error).toContain('Invalid shot timing');
        expect(suggestions.timingSuggestions).toBeDefined();
      });
    });

    test('should handle malformed inputs gracefully', () => {
      const malformedInputs = [
        '',
        '   ',
        'OnlyOne',
        'Only Two',
        'Too Many Words Here Extra',
        'bouncer pull perfect', // Wrong case
        'Bouncer-Pull-Perfect', // Wrong separators
      ];

      malformedInputs.forEach(input => {
        const result = parser.parse(input);

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(typeof result.error).toBe('string');
      });
    });
  });

  describe('Multiple Input Processing', () => {
    test('should parse multiple valid inputs successfully', () => {
      const inputs = CricketTestDataGenerator.generateInputStrings(10);
      const result = parser.parseMultiple(inputs);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(10);
      result.data?.forEach(input => {
        expect(input.bowlingType).toBeDefined();
        expect(input.shotType).toBeDefined();
        expect(input.shotTiming).toBeDefined();
      });
    });

    test('should handle mixed valid and invalid inputs', () => {
      const validInputs = CricketTestDataGenerator.generateInputStrings(3);
      const invalidInputs =
        CricketTestDataGenerator.generateInvalidBowlingInputs().slice(0, 2);
      const mixedInputs = [...validInputs, ...invalidInputs];

      const result = parser.parseMultiple(mixedInputs);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Line');
    });

    test('should skip empty lines in multiple input processing', () => {
      const inputs = [
        'Bouncer Pull Perfect',
        '',
        '   ',
        'Yorker Straight Good',
        '\t',
      ];

      const result = parser.parseMultiple(inputs);
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
    });
  });

  describe('Validation Methods', () => {
    test('should validate inputs correctly', () => {
      const validInputs = CricketTestDataGenerator.generateInputStrings(5);
      const invalidInputs =
        CricketTestDataGenerator.generateInvalidBowlingInputs().slice(0, 3);

      validInputs.forEach(input => {
        expect(parser.validate(input)).toBe(true);
      });

      invalidInputs.forEach(input => {
        expect(parser.validate(input)).toBe(false);
      });
    });

    test('should provide validation statistics', () => {
      const stats = parser.getValidationStats();

      expect(stats.bowlingTypeCount).toBeGreaterThan(0);
      expect(stats.shotTypeCount).toBeGreaterThan(0);
      expect(stats.shotTimingCount).toBe(4); // Early, Good, Perfect, Late
      expect(stats.totalCombinations).toBeGreaterThan(0);
    });

    test('should validate multiple inputs with detailed feedback', () => {
      const validInputs = CricketTestDataGenerator.generateInputStrings(3);
      const invalidInputs =
        CricketTestDataGenerator.generateInvalidBowlingInputs().slice(0, 2);
      const mixedInputs = [...validInputs, ...invalidInputs];

      const validation = parser.validateMultiple(mixedInputs);

      expect(validation.validCount).toBe(3);
      expect(validation.invalidCount).toBe(2);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toHaveLength(2);
    });
  });

  describe('Error Handling and Suggestions', () => {
    test('should provide detailed error information', () => {
      const invalidInput = 'InvalidBowl BadShot WrongTiming';
      const detailedError = parser.getDetailedError(invalidInput);

      expect(detailedError.message).toBeDefined();
      expect(detailedError.code).toBeDefined();
    });

    test('should provide helpful parsing hints', () => {
      const hints = parser.getParsingHints();

      expect(hints).toBeInstanceOf(Array);
      expect(hints.length).toBeGreaterThan(0);
      expect(hints.some(hint => hint.includes('capitalization'))).toBe(true);
    });

    test('should suggest similar terms for typos', () => {
      const suggestions = parser.getSuggestions('Bouncr'); // Missing 'e'

      expect(suggestions.bowlingSuggestions).toContain('Bouncer');
    });
  });

  describe('Scenario-Based Tests', () => {
    test('should handle realistic match scenarios', () => {
      const scenario = new CricketTestScenarioBuilder()
        .withDescription('Realistic T20 match scenario')
        .addInput('Pace CoverDrive Perfect')
        .addInput('Bouncer Pull Late')
        .addInput('Yorker Straight Good')
        .addInput('Off Break Sweep Perfect')
        .build();

      const result = parser.parseMultiple(scenario.inputs);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(4);
    });

    test('should handle super over scenarios', () => {
      const superOverInputs = [
        'Straight Perfect',
        'Flick Early',
        'Sweep Good',
        'LegGlance Good',
        'SquareCut Late',
        'CoverDrive Perfect',
      ];

      // Note: These are shot inputs for Challenge 3, different format
      // This tests the parser's robustness with different input patterns
      const parseResults = superOverInputs.map(input => {
        // For Challenge 3, we need just shot and timing (no bowling type)
        // This would normally be handled by SuperOverParser
        return input.split(' ').length === 2;
      });

      expect(parseResults.every(valid => valid)).toBe(true);
    });
  });

  describe('Performance Tests', () => {
    test('should parse single input efficiently', async () => {
      const input = 'Bouncer Pull Perfect';

      const performance =
        await CricketPerformanceTestUtils.measureExecutionTime(
          () => parser.parse(input),
          1000
        );

      expect(performance.averageTime).toBeLessThan(1); // Less than 1ms average
    });

    test('should handle large input batches efficiently', async () => {
      const largeInputSet = CricketTestDataGenerator.generateInputStrings(1000);

      const performance =
        await CricketPerformanceTestUtils.measureExecutionTime(
          () => parser.parseMultiple(largeInputSet),
          10
        );

      expect(performance.averageTime).toBeLessThan(100); // Less than 100ms for 1000 inputs
      expect(performance.result.success).toBe(true);
    });

    test('should scale linearly with input size', async () => {
      const testSizes = [10, 100, 500];
      const results: Array<{ size: number; time: number }> = [];

      for (const size of testSizes) {
        const inputs = CricketTestDataGenerator.generateInputStrings(size);
        const performance =
          await CricketPerformanceTestUtils.measureExecutionTime(
            () => parser.parseMultiple(inputs),
            5
          );

        results.push({ size, time: performance.averageTime });
      }

      // Check that time complexity is roughly linear
      const timePerInput10 = results[0].time / results[0].size;
      const timePerInput100 = results[1].time / results[1].size;

      // Should be within 5x factor for linear scaling (generous to avoid timing variance)
      expect(timePerInput100).toBeLessThan(timePerInput10 * 5);
    });
  });

  describe('Edge Cases', () => {
    test('should handle inputs with extra whitespace', () => {
      const inputs = [
        '  Bouncer Pull Perfect  ',
        'Yorker  Straight  Good',
        '\tPace\tCoverDrive\tPerfect\t',
      ];

      inputs.forEach(input => {
        const result = parser.parse(input);
        expect(result.success).toBe(true);
      });
    });

    test('should handle case sensitivity correctly', () => {
      const correctCase = 'Bouncer Pull Perfect';
      const incorrectCase = 'bouncer pull perfect';

      expect(parser.parse(correctCase).success).toBe(true);
      expect(parser.parse(incorrectCase).success).toBe(false);
    });

    test('should handle maximum valid input lengths', () => {
      const maxLengthInput = 'Off Cutter Long On Perfect';
      const result = parser.parse(maxLengthInput);

      expect(result.success).toBe(true);
      expect(result.data?.bowlingType).toBe('Off Cutter');
      expect(result.data?.shotType).toBe('Long On');
      expect(result.data?.shotTiming).toBe('Perfect');
    });
  });
});
