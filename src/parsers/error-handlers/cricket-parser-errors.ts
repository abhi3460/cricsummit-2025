/**
 * Cricket Parser Error Handlers
 * Specialized error handling and messaging for cricket input parsing
 */

import { InputValidationError } from '../../errors/cricket-errors';
import { ERROR_MESSAGES } from '../../constants/game-rules';
import { MultiWordParser } from '../utils/multi-word-parser';
import {
  isUnrealisticCombination,
  getRealisticAlternatives,
  getRealisticOutcomeMessage,
} from '../../config/cricket-realism-rules';
import { BowlingType, ShotType } from '../../types';

interface DetailedParseError {
  message: string;
  code: string;
  suggestions?: string[];
  context?: Record<string, unknown>;
}

/**
 * Handles cricket parsing errors with detailed information and suggestions
 */
export class CricketParserErrorHandler {
  private readonly multiWordParser?: MultiWordParser;

  constructor(multiWordParser?: MultiWordParser) {
    this.multiWordParser = multiWordParser;
  }

  /**
   * Creates a detailed error for invalid bowling type
   */
  createBowlingTypeError(invalidBowling: string): DetailedParseError {
    const suggestions = this.multiWordParser?.suggestValidTerms(invalidBowling);

    return {
      message: `${ERROR_MESSAGES.INVALID_BOWLING_TYPE}: "${invalidBowling}"`,
      code: 'INVALID_BOWLING_TYPE',
      suggestions: suggestions?.bowlingSuggestions || [],
      context: {
        providedValue: invalidBowling,
        category: 'bowling',
      },
    };
  }

  /**
   * Creates a detailed error for invalid shot type
   */
  createShotTypeError(invalidShot: string): DetailedParseError {
    const suggestions = this.multiWordParser?.suggestValidTerms(invalidShot);

    return {
      message: `${ERROR_MESSAGES.INVALID_SHOT_TYPE}: "${invalidShot}"`,
      code: 'INVALID_SHOT_TYPE',
      suggestions: suggestions?.shotSuggestions || [],
      context: {
        providedValue: invalidShot,
        category: 'shot',
      },
    };
  }

  /**
   * Creates a detailed error for invalid shot timing
   */
  createShotTimingError(invalidTiming: string): DetailedParseError {
    const suggestions = this.multiWordParser?.suggestValidTerms(invalidTiming);

    return {
      message: `${ERROR_MESSAGES.INVALID_SHOT_TIMING}: "${invalidTiming}"`,
      code: 'INVALID_SHOT_TIMING',
      suggestions: suggestions?.timingSuggestions || [],
      context: {
        providedValue: invalidTiming,
        category: 'timing',
      },
    };
  }

  /**
   * Creates a detailed error for format issues
   */
  createFormatError(input: string, expectedFormat: string): DetailedParseError {
    return {
      message: `${ERROR_MESSAGES.INVALID_INPUT_FORMAT}. Expected: ${expectedFormat}`,
      code: 'INVALID_FORMAT',
      context: {
        providedInput: input,
        expectedFormat,
      },
    };
  }

  /**
   * Creates a detailed error for empty input
   */
  createEmptyInputError(): DetailedParseError {
    return {
      message: ERROR_MESSAGES.EMPTY_INPUT,
      code: 'EMPTY_INPUT',
      suggestions: ['Provide input in format: "BowlingType ShotType Timing"'],
    };
  }

  /**
   * Creates a detailed error for unrealistic bowling-shot combinations
   */
  createUnrealisticCombinationError(
    bowlingType: BowlingType,
    shotType: ShotType
  ): DetailedParseError {
    const unrealisticCombo = isUnrealisticCombination(bowlingType, shotType);

    if (unrealisticCombo) {
      const alternatives = getRealisticAlternatives(bowlingType);

      return {
        message: getRealisticOutcomeMessage(bowlingType, shotType),
        code: 'UNREALISTIC_COMBINATION',
        suggestions: alternatives,
        context: {
          bowlingType,
          shotType,
          reason: unrealisticCombo.reason,
          realisticOutcome: unrealisticCombo.realisticOutcome,
          alternativeSuggestion: unrealisticCombo.alternativeSuggestion,
        },
      };
    }

    // Fallback for any combination that might be considered unrealistic
    return {
      message:
        'Unrealistic combination detected - using realistic cricket outcome',
      code: 'UNREALISTIC_COMBINATION',
      suggestions: getRealisticAlternatives(bowlingType),
      context: {
        bowlingType,
        shotType,
      },
    };
  }

  /**
   * Analyzes input and provides specific error information
   */
  analyzeInputError(input: string): DetailedParseError {
    if (!input || !input.trim()) {
      return this.createEmptyInputError();
    }

    const words = input
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0);

    if (words.length < 3) {
      return this.createFormatError(
        input,
        'BowlingType ShotType Timing (minimum 3 words)'
      );
    }

    if (words.length > 5) {
      return this.createFormatError(
        input,
        'BowlingType ShotType Timing (maximum 5 words for multi-word types)'
      );
    }

    // Default to general format error
    return this.createFormatError(input, 'BowlingType ShotType Timing');
  }

  /**
   * Converts detailed error to InputValidationError
   */
  toInputValidationError(
    detailedError: DetailedParseError
  ): InputValidationError {
    let message = detailedError.message;

    if (detailedError.suggestions && detailedError.suggestions.length > 0) {
      message += `. Did you mean: ${detailedError.suggestions.join(', ')}?`;
    }

    return new InputValidationError(message, {
      code: detailedError.code,
      ...detailedError.context,
    });
  }

  /**
   * Gets helpful hints for successful parsing
   */
  getParsingHints(): string[] {
    return [
      'Use exact capitalization: "Bouncer", "Pull", "Perfect"',
      'Multi-word terms: "Leg Cutter", "Long On", "Off Break"',
      'Format: "BowlingType ShotType Timing"',
      'Valid timings: Early, Good, Perfect, Late',
      'No extra spaces or special characters',
    ];
  }

  /**
   * Validates input structure and provides specific feedback
   */
  validateInputStructure(input: string): {
    isValid: boolean;
    errors: DetailedParseError[];
    warnings: string[];
  } {
    const errors: DetailedParseError[] = [];
    const warnings: string[] = [];

    if (!input || !input.trim()) {
      errors.push(this.createEmptyInputError());
      return { isValid: false, errors, warnings };
    }

    const trimmed = input.trim();
    const words = trimmed.split(/\s+/).filter(w => w.length > 0);

    // Check for too few words
    if (words.length < 3) {
      errors.push(this.createFormatError(input, 'Minimum 3 words required'));
    }

    // Check for too many words
    if (words.length > 5) {
      errors.push(this.createFormatError(input, 'Maximum 5 words allowed'));
    }

    // Check for extra whitespace
    if (input !== trimmed) {
      warnings.push('Input has leading/trailing whitespace');
    }

    // Check for multiple spaces
    if (input.includes('  ')) {
      warnings.push('Input contains multiple consecutive spaces');
    }

    // Check for special characters
    const hasSpecialChars = /[^a-zA-Z\s]/.test(input);
    if (hasSpecialChars) {
      warnings.push('Input contains special characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
