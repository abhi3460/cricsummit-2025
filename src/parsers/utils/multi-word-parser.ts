/**
 * Multi-Word Parser Utility
 * Handles parsing of cricket inputs with multi-word terms like "Leg Cutter", "Long On", etc.
 */

import { BowlingType, ShotType, ShotTiming, CricketInput } from '../../types';
import { CricketInputValidator } from '../validators/cricket-input-validator';
import { InputParseResult } from '../input-parser.interface';
import { ERROR_MESSAGES } from '../../constants/game-rules';

/**
 * Utility class for parsing multi-word cricket terms
 */
export class MultiWordParser {
  private readonly validator: CricketInputValidator;

  constructor(validator: CricketInputValidator) {
    this.validator = validator;
  }

  /**
   * Parses input string considering multi-word bowling and shot types
   */
  parseInputWithMultiWords(input: string): InputParseResult<CricketInput> {
    const words = input
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0);

    if (words.length < 3) {
      return {
        success: false,
        error: ERROR_MESSAGES.INVALID_INPUT_FORMAT,
      };
    }

    // Try to parse bowling type (can be 1 or 2 words)
    const bowlingParseResult = this.extractBowlingType(words);
    if (!bowlingParseResult.success) {
      return {
        success: false,
        error: bowlingParseResult.error,
      };
    }

    const { term: bowlingType, remainingWords: afterBowling } =
      bowlingParseResult.data!;

    // Try to parse shot type (can be 1 or 2 words)
    const shotParseResult = this.extractShotType(afterBowling);
    if (!shotParseResult.success) {
      return {
        success: false,
        error: shotParseResult.error,
      };
    }

    const { term: shotType, remainingWords: afterShot } = shotParseResult.data!;

    // The remaining word should be the timing
    if (afterShot.length !== 1) {
      return {
        success: false,
        error:
          afterShot.length === 0
            ? 'Missing shot timing'
            : `Too many words in input: ${afterShot.join(' ')}`,
      };
    }

    const shotTiming = afterShot[0];

    // Final validation
    if (!this.validator.isValidShotTiming(shotTiming)) {
      return {
        success: false,
        error: `${ERROR_MESSAGES.INVALID_SHOT_TIMING}: ${shotTiming}`,
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
  }

  /**
   * Extracts bowling type (1 or 2 words) from the beginning of words array
   */
  private extractBowlingType(
    words: string[]
  ): InputParseResult<{ term: string; remainingWords: string[] }> {
    if (words.length < 2) {
      return {
        success: false,
        error: 'Insufficient words for bowling type extraction',
      };
    }

    // Try 2-word bowling types first
    const twoWordBowling = `${words[0]} ${words[1]}`;
    if (this.validator.isValidBowlingType(twoWordBowling)) {
      return {
        success: true,
        data: {
          term: twoWordBowling,
          remainingWords: words.slice(2),
        },
      };
    }

    // Try 1-word bowling type
    const oneWordBowling = words[0];
    if (this.validator.isValidBowlingType(oneWordBowling)) {
      return {
        success: true,
        data: {
          term: oneWordBowling,
          remainingWords: words.slice(1),
        },
      };
    }

    return {
      success: false,
      error: `${ERROR_MESSAGES.INVALID_BOWLING_TYPE}: ${oneWordBowling}`,
    };
  }

  /**
   * Extracts shot type (1 or 2 words) from the beginning of words array
   */
  private extractShotType(
    words: string[]
  ): InputParseResult<{ term: string; remainingWords: string[] }> {
    if (words.length < 1) {
      return {
        success: false,
        error: 'No words available for shot type extraction',
      };
    }

    // Try 2-word shot types first (if we have at least 2 words)
    if (words.length >= 2) {
      const twoWordShot = `${words[0]} ${words[1]}`;
      if (this.validator.isValidShotType(twoWordShot)) {
        return {
          success: true,
          data: {
            term: twoWordShot,
            remainingWords: words.slice(2),
          },
        };
      }
    }

    // Try 1-word shot type
    const oneWordShot = words[0];
    if (this.validator.isValidShotType(oneWordShot)) {
      return {
        success: true,
        data: {
          term: oneWordShot,
          remainingWords: words.slice(1),
        },
      };
    }

    return {
      success: false,
      error: `${ERROR_MESSAGES.INVALID_SHOT_TYPE}: ${oneWordShot}`,
    };
  }

  /**
   * Provides helpful suggestions for invalid terms
   */
  suggestValidTerms(invalidTerm: string): {
    bowlingSuggestions: string[];
    shotSuggestions: string[];
    timingSuggestions: string[];
  } {
    const bowlingTypes = this.validator.getValidBowlingTypes();
    const shotTypes = this.validator.getValidShotTypes();
    const timings = this.validator.getValidShotTimings();

    return {
      bowlingSuggestions: this.findSimilarTerms(invalidTerm, bowlingTypes),
      shotSuggestions: this.findSimilarTerms(invalidTerm, shotTypes),
      timingSuggestions: this.findSimilarTerms(invalidTerm, timings),
    };
  }

  /**
   * Finds similar terms using simple string similarity
   */
  private findSimilarTerms(term: string, validTerms: string[]): string[] {
    const normalizedTerm = term.toLowerCase();

    return validTerms
      .filter(validTerm => {
        const normalizedValidTerm = validTerm.toLowerCase();
        return (
          normalizedValidTerm.includes(normalizedTerm) ||
          normalizedTerm.includes(normalizedValidTerm) ||
          this.calculateSimilarity(normalizedTerm, normalizedValidTerm) > 0.5
        );
      })
      .slice(0, 3); // Return top 3 suggestions
  }

  /**
   * Calculates simple string similarity score
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Calculates Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }
}
