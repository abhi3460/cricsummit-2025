/**
 * Cricket Input Parser - Refactored
 * Main parser class that orchestrates validation, parsing, and error handling
 */

import { BowlingType, ShotType, ShotTiming, CricketInput } from '../types';
import { IInputParser, InputParseResult } from './input-parser.interface';
import { CricketInputValidator } from './validators/cricket-input-validator';
import { MultiWordParser } from './utils/multi-word-parser';
import { CricketParserErrorHandler } from './error-handlers/cricket-parser-errors';
import { ERROR_MESSAGES } from '../constants/game-rules';

export class CricketInputParser implements IInputParser<CricketInput> {
  private readonly validator: CricketInputValidator;
  private readonly multiWordParser: MultiWordParser;
  private readonly errorHandler: CricketParserErrorHandler;

  constructor() {
    this.validator = new CricketInputValidator();
    this.multiWordParser = new MultiWordParser(this.validator);
    this.errorHandler = new CricketParserErrorHandler(this.multiWordParser);
  }

  /**
   * Parses a single cricket input line
   */
  parse(input: string): InputParseResult<CricketInput> {
    try {
      // Initial structure validation
      const structureValidation =
        this.errorHandler.validateInputStructure(input);
      if (!structureValidation.isValid) {
        return {
          success: false,
          error:
            structureValidation.errors[0]?.message ||
            ERROR_MESSAGES.INVALID_INPUT_FORMAT,
        };
      }

      // Parse using multi-word parser
      const parseResult = this.multiWordParser.parseInputWithMultiWords(input);
      if (!parseResult.success) {
        return parseResult;
      }

      // Additional validation (defensive programming)
      const { bowlingType, shotType, shotTiming } = parseResult.data!;
      const validationResult = this.validator.validateInput(
        bowlingType,
        shotType,
        shotTiming
      );

      if (!validationResult.isValid) {
        return {
          success: false,
          error:
            validationResult.errors[0] || ERROR_MESSAGES.INVALID_INPUT_FORMAT,
        };
      }

      return {
        success: true,
        data: {
          bowlingType: bowlingType as BowlingType,
          shotType: shotType as ShotType,
          shotTiming: shotTiming as ShotTiming,
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : ERROR_MESSAGES.PARSING_ERROR,
      };
    }
  }

  /**
   * Parses multiple cricket input lines
   */
  parseMultiple(inputs: string[]): InputParseResult<CricketInput[]> {
    try {
      if (!inputs || inputs.length === 0) {
        return {
          success: false,
          error: ERROR_MESSAGES.EMPTY_INPUT,
        };
      }

      const results: CricketInput[] = [];
      const errors: string[] = [];

      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        if (!input || !input.trim()) {
          continue; // Skip empty lines
        }

        const parseResult = this.parse(input);
        if (parseResult.success && parseResult.data) {
          results.push(parseResult.data);
        } else {
          errors.push(`Line ${i + 1}: ${parseResult.error}`);
        }
      }

      if (errors.length > 0) {
        return {
          success: false,
          error: errors.join('\n'),
        };
      }

      if (results.length === 0) {
        return {
          success: false,
          error: ERROR_MESSAGES.NO_VALID_INPUTS,
        };
      }

      return {
        success: true,
        data: results,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : ERROR_MESSAGES.PARSING_ERROR,
      };
    }
  }

  /**
   * Validates input without parsing
   */
  validate(input: string): boolean {
    const parseResult = this.parse(input);
    return parseResult.success;
  }

  /**
   * Gets valid bowling types
   */
  getValidBowlingTypes(): string[] {
    return this.validator.getValidBowlingTypes();
  }

  /**
   * Gets valid shot types
   */
  getValidShotTypes(): string[] {
    return this.validator.getValidShotTypes();
  }

  /**
   * Gets valid shot timings
   */
  getValidShotTimings(): string[] {
    return this.validator.getValidShotTimings();
  }

  /**
   * Gets parsing hints for users
   */
  getParsingHints(): string[] {
    return this.errorHandler.getParsingHints();
  }

  /**
   * Gets suggestions for invalid terms
   */
  getSuggestions(invalidTerm: string): {
    bowlingSuggestions: string[];
    shotSuggestions: string[];
    timingSuggestions: string[];
  } {
    return this.multiWordParser.suggestValidTerms(invalidTerm);
  }

  /**
   * Gets validation statistics
   */
  getValidationStats() {
    return this.validator.getValidationStats();
  }

  /**
   * Gets detailed error information for debugging
   */
  getDetailedError(input: string): {
    message: string;
    code: string;
    suggestions?: string[];
    context?: Record<string, unknown>;
  } {
    return this.errorHandler.analyzeInputError(input);
  }

  /**
   * Validates multiple inputs and returns detailed feedback
   */
  validateMultiple(inputs: string[]): {
    isValid: boolean;
    validCount: number;
    invalidCount: number;
    errors: Array<{
      lineNumber: number;
      input: string;
      error: string;
    }>;
  } {
    const errors: Array<{ lineNumber: number; input: string; error: string }> =
      [];
    let validCount = 0;

    inputs.forEach((input, index) => {
      if (!input || !input.trim()) {
        return; // Skip empty lines
      }

      const parseResult = this.parse(input);
      if (parseResult.success) {
        validCount++;
      } else {
        errors.push({
          lineNumber: index + 1,
          input: input.trim(),
          error: parseResult.error || 'Unknown error',
        });
      }
    });

    return {
      isValid: errors.length === 0 && validCount > 0,
      validCount,
      invalidCount: errors.length,
      errors,
    };
  }
}
