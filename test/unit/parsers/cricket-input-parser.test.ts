/**
 * Unit Tests for Cricket Input Parser
 */

import { CricketInputParser } from '../../../src/parsers/cricket-input-parser';
import { BowlingType, ShotType, ShotTiming } from '../../../src/types';

describe('CricketInputParser', () => {
  let parser: CricketInputParser;

  beforeEach(() => {
    parser = new CricketInputParser();
  });

  describe('parse', () => {
    it('should parse valid input correctly', () => {
      const input = 'Bouncer Pull Perfect';
      const result = parser.parse(input);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        bowlingType: 'Bouncer' as BowlingType,
        shotType: 'Pull' as ShotType,
        shotTiming: 'Perfect' as ShotTiming,
      });
      expect(result.error).toBeUndefined();
    });

    it('should handle empty input', () => {
      const input = '';
      const result = parser.parse(input);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBe('Input cannot be empty');
    });

    it('should handle whitespace-only input', () => {
      const input = '   ';
      const result = parser.parse(input);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBe('Input cannot be empty');
    });

    it('should handle insufficient input parts', () => {
      const input = 'Bouncer Pull';
      const result = parser.parse(input);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toContain('Invalid input format');
    });

    it('should handle too many input parts', () => {
      const input = 'Bouncer Pull Perfect Extra';
      const result = parser.parse(input);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toContain('Too many words in input');
    });

    it('should validate bowling type', () => {
      const input = 'InvalidBowling Pull Perfect';
      const result = parser.parse(input);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toContain('Invalid bowling type');
    });

    it('should validate shot type', () => {
      const input = 'Bouncer InvalidShot Perfect';
      const result = parser.parse(input);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toContain('Invalid shot type');
    });

    it('should validate shot timing', () => {
      const input = 'Bouncer Pull InvalidTiming';
      const result = parser.parse(input);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toContain('Invalid shot timing');
    });

    it('should handle all valid bowling types', () => {
      const validBowlingTypes = [
        'Bouncer',
        'Inswinger',
        'Outswinger',
        'Leg Cutter',
        'Off Cutter',
        'Slower Ball',
        'Yorker',
        'Pace',
        'Off Break',
        'Doosra',
      ];

      validBowlingTypes.forEach(bowlingType => {
        const input = `${bowlingType} Pull Perfect`;
        const result = parser.parse(input);
        expect(result.success).toBe(true);
        expect(result.data?.bowlingType).toBe(bowlingType);
      });
    });

    it('should handle all valid shot types', () => {
      const validShotTypes = [
        'Straight',
        'Sweep',
        'Flick',
        'CoverDrive',
        'LegGlance',
        'Pull',
        'Long On',
        'Scoop',
        'SquareCut',
        'UpperCut',
      ];

      validShotTypes.forEach(shotType => {
        const input = `Bouncer ${shotType} Perfect`;
        const result = parser.parse(input);
        expect(result.success).toBe(true);
        expect(result.data?.shotType).toBe(shotType);
      });
    });

    it('should handle all valid shot timings', () => {
      const validTimings = ['Early', 'Good', 'Perfect', 'Late'];

      validTimings.forEach(timing => {
        const input = `Bouncer Pull ${timing}`;
        const result = parser.parse(input);
        expect(result.success).toBe(true);
        expect(result.data?.shotTiming).toBe(timing);
      });
    });
  });

  describe('parseMultiple', () => {
    it('should parse multiple valid inputs', () => {
      const inputs = [
        'Bouncer Pull Perfect',
        'Yorker Straight Early',
        'Pace Straight Good',
      ];
      const result = parser.parseMultiple(inputs);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(3);
      expect(result.data![0]).toEqual({
        bowlingType: 'Bouncer',
        shotType: 'Pull',
        shotTiming: 'Perfect',
      });
    });

    it('should skip empty lines', () => {
      const inputs = [
        'Bouncer Pull Perfect',
        '',
        'Yorker Straight Early',
        '   ',
        'Pace Straight Good',
      ];
      const result = parser.parseMultiple(inputs);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(3);
    });

    it('should return error if any line is invalid', () => {
      const inputs = [
        'Bouncer Pull Perfect',
        'InvalidBowling Pull Perfect',
        'Pace Straight Good',
      ];
      const result = parser.parseMultiple(inputs);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toContain('Line 2');
      expect(result.error).toContain('Invalid bowling type');
    });
  });

  describe('validate', () => {
    it('should return true for valid input', () => {
      const input = 'Bouncer Pull Perfect';
      expect(parser.validate(input)).toBe(true);
    });

    it('should return false for invalid input', () => {
      const input = 'Invalid Input';
      expect(parser.validate(input)).toBe(false);
    });
  });

  describe('getValidTypes', () => {
    it('should return valid bowling types', () => {
      const types = parser.getValidBowlingTypes();
      expect(types).toContain('Bouncer');
      expect(types).toContain('Yorker');
      expect(types).toContain('Doosra');
    });

    it('should return valid shot types', () => {
      const types = parser.getValidShotTypes();
      expect(types).toContain('Pull');
      expect(types).toContain('Straight');
      expect(types).toContain('Scoop');
    });

    it('should return valid shot timings', () => {
      const timings = parser.getValidShotTimings();
      expect(timings).toContain('Early');
      expect(timings).toContain('Good');
      expect(timings).toContain('Perfect');
      expect(timings).toContain('Late');
    });
  });
});
