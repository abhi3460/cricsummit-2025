/**
 * Unit Tests for Challenge1 Service
 */

import { Challenge1Service } from '../../../src/services/challenge1-service';
import { IOutcomeEngine } from '../../../src/engines/outcome-engine';
import { CricketInputParser } from '../../../src/parsers/cricket-input-parser';
import { InputValidationError } from '../../../src/errors/cricket-errors';
import {
  CricketInput,
  BowlingType,
  ShotType,
  ShotTiming,
} from '../../../src/types';

// Mock dependencies
const mockOutcomeEngine: IOutcomeEngine = {
  predictOutcome: jest.fn(),
  setStrategy: jest.fn(),
  getCurrentStrategy: jest.fn(),
  isValidCombination: jest.fn(),
};

const mockInputParser = {
  parse: jest.fn(),
  parseMultiple: jest.fn(),
  validate: jest.fn(),
  getValidBowlingTypes: jest.fn(),
  getValidShotTypes: jest.fn(),
  getValidShotTimings: jest.fn(),
} as unknown as jest.Mocked<CricketInputParser>;

describe('Challenge1Service', () => {
  let service: Challenge1Service;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new Challenge1Service(mockOutcomeEngine, mockInputParser);
  });

  describe('processInput', () => {
    it('should process valid input and return outcomes', () => {
      const input = 'Bouncer Pull Perfect\nYorker Straight Early';
      const parsedData: CricketInput[] = [
        {
          bowlingType: 'Bouncer' as BowlingType,
          shotType: 'Pull' as ShotType,
          shotTiming: 'Perfect' as ShotTiming,
        },
        {
          bowlingType: 'Yorker' as BowlingType,
          shotType: 'Straight' as ShotType,
          shotTiming: 'Early' as ShotTiming,
        },
      ];

      mockInputParser.parseMultiple.mockReturnValue({
        success: true,
        data: parsedData,
      });

      (mockOutcomeEngine.predictOutcome as jest.Mock)
        .mockReturnValueOnce('6 runs')
        .mockReturnValueOnce('1 wicket');

      const result = service.processInput(input);

      expect(result).toEqual(['6 runs', '1 wicket']);
      expect(mockInputParser.parseMultiple).toHaveBeenCalledWith([
        'Bouncer Pull Perfect',
        'Yorker Straight Early',
      ]);
      expect(mockOutcomeEngine.predictOutcome).toHaveBeenCalledTimes(2);
    });

    it('should throw InputValidationError for invalid input', () => {
      const input = 'Invalid Input';

      mockInputParser.parseMultiple.mockReturnValue({
        success: false,
        error: 'Invalid input format',
      });

      expect(() => service.processInput(input)).toThrow(InputValidationError);
      expect(() => service.processInput(input)).toThrow('Invalid input format');
    });

    it('should filter empty lines from input', () => {
      const input = 'Bouncer Pull Perfect\n\nYorker Straight Early\n   \n';
      const parsedData: CricketInput[] = [
        {
          bowlingType: 'Bouncer' as BowlingType,
          shotType: 'Pull' as ShotType,
          shotTiming: 'Perfect' as ShotTiming,
        },
        {
          bowlingType: 'Yorker' as BowlingType,
          shotType: 'Straight' as ShotType,
          shotTiming: 'Early' as ShotTiming,
        },
      ];

      mockInputParser.parseMultiple.mockReturnValue({
        success: true,
        data: parsedData,
      });

      (mockOutcomeEngine.predictOutcome as jest.Mock)
        .mockReturnValueOnce('6 runs')
        .mockReturnValueOnce('1 wicket');

      const result = service.processInput(input);

      expect(result).toEqual(['6 runs', '1 wicket']);
      expect(mockInputParser.parseMultiple).toHaveBeenCalledWith([
        'Bouncer Pull Perfect',
        'Yorker Straight Early',
      ]);
    });
  });

  describe('processInputLines', () => {
    it('should process array of input lines', () => {
      const inputLines = ['Bouncer Pull Perfect', 'Yorker Straight Early'];
      const parsedData: CricketInput[] = [
        {
          bowlingType: 'Bouncer' as BowlingType,
          shotType: 'Pull' as ShotType,
          shotTiming: 'Perfect' as ShotTiming,
        },
        {
          bowlingType: 'Yorker' as BowlingType,
          shotType: 'Straight' as ShotType,
          shotTiming: 'Early' as ShotTiming,
        },
      ];

      mockInputParser.parseMultiple.mockReturnValue({
        success: true,
        data: parsedData,
      });

      (mockOutcomeEngine.predictOutcome as jest.Mock)
        .mockReturnValueOnce('6 runs')
        .mockReturnValueOnce('1 wicket');

      const result = service.processInputLines(inputLines);

      expect(result).toEqual(['6 runs', '1 wicket']);
      expect(mockInputParser.parseMultiple).toHaveBeenCalledWith(inputLines);
    });

    it('should call outcome engine with correct parameters', () => {
      const inputLines = ['Bouncer Pull Perfect'];
      const parsedData: CricketInput[] = [
        {
          bowlingType: 'Bouncer' as BowlingType,
          shotType: 'Pull' as ShotType,
          shotTiming: 'Perfect' as ShotTiming,
        },
      ];

      mockInputParser.parseMultiple.mockReturnValue({
        success: true,
        data: parsedData,
      });

      (mockOutcomeEngine.predictOutcome as jest.Mock).mockReturnValue('6 runs');

      service.processInputLines(inputLines);

      expect(mockOutcomeEngine.predictOutcome).toHaveBeenCalledWith(
        'Bouncer',
        'Pull',
        'Perfect'
      );
    });
  });

  describe('getSampleInput', () => {
    it('should return array of sample input strings', () => {
      const sampleInput = service.getSampleInput();

      expect(Array.isArray(sampleInput)).toBe(true);
      expect(sampleInput.length).toBeGreaterThan(0);
      expect(typeof sampleInput[0]).toBe('string');
    });
  });

  describe('getSampleOutput', () => {
    it('should return array of sample output strings', () => {
      const sampleOutput = service.getSampleOutput();

      expect(Array.isArray(sampleOutput)).toBe(true);
      expect(sampleOutput.length).toBeGreaterThan(0);
      expect(typeof sampleOutput[0]).toBe('string');
    });
  });

  describe('validateInput', () => {
    it('should return validation result from parser', () => {
      const input = 'Bouncer Pull Perfect';

      mockInputParser.validate.mockReturnValue(true);
      expect(service.validateInput(input)).toBe(true);

      mockInputParser.validate.mockReturnValue(false);
      expect(service.validateInput(input)).toBe(false);

      expect(mockInputParser.validate).toHaveBeenCalledWith(input);
    });
  });

  describe('getValidInputFormats', () => {
    it('should return valid input formats from parser', () => {
      const mockFormats = {
        bowlingTypes: ['Bouncer', 'Yorker'],
        shotTypes: ['Pull', 'Straight'],
        shotTimings: ['Early', 'Perfect'],
      };

      mockInputParser.getValidBowlingTypes.mockReturnValue(
        mockFormats.bowlingTypes
      );
      mockInputParser.getValidShotTypes.mockReturnValue(mockFormats.shotTypes);
      mockInputParser.getValidShotTimings.mockReturnValue(
        mockFormats.shotTimings
      );

      const result = service.getValidInputFormats();

      expect(result).toEqual(mockFormats);
      expect(mockInputParser.getValidBowlingTypes).toHaveBeenCalled();
      expect(mockInputParser.getValidShotTypes).toHaveBeenCalled();
      expect(mockInputParser.getValidShotTimings).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle parsing errors gracefully', () => {
      const input = 'Invalid Input';

      mockInputParser.parseMultiple.mockReturnValue({
        success: false,
        error: 'Parsing failed',
      });

      expect(() => service.processInput(input)).toThrow(InputValidationError);
      expect(() => service.processInput(input)).toThrow('Parsing failed');
    });

    it('should propagate outcome engine errors', () => {
      const input = 'Bouncer Pull Perfect';
      const parsedData: CricketInput[] = [
        {
          bowlingType: 'Bouncer' as BowlingType,
          shotType: 'Pull' as ShotType,
          shotTiming: 'Perfect' as ShotTiming,
        },
      ];

      mockInputParser.parseMultiple.mockReturnValue({
        success: true,
        data: parsedData,
      });

      (mockOutcomeEngine.predictOutcome as jest.Mock).mockImplementation(() => {
        throw new Error('Outcome engine error');
      });

      expect(() => service.processInput(input)).toThrow('Outcome engine error');
    });
  });
});
