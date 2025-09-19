/**
 * Super Over Input Parser
 * Handles parsing and validation of Super Over shot inputs
 */

import { ShotType, ShotTiming } from '../types';
import { GAME_CONSTANTS, ERROR_MESSAGES } from '../constants/game-rules';
import { IInputParser, InputParseResult } from './input-parser.interface';

export interface SuperOverShotInput {
  shotType: ShotType;
  shotTiming: ShotTiming;
}

export class SuperOverParser implements IInputParser<SuperOverShotInput> {
  private readonly validShotTypes: Set<string>;
  private readonly validShotTimings: Set<string>;

  constructor() {
    this.validShotTypes = new Set([
      'Straight',
      'Flick',
      'Long On',
      'SquareCut',
      'Sweep',
      'CoverDrive',
      'Pull',
      'Scoop',
      'LegGlance',
      'UpperCut',
    ]);

    this.validShotTimings = new Set(['Early', 'Good', 'Perfect', 'Late']);
  }

  parse(input: string): InputParseResult<SuperOverShotInput> {
    try {
      const trimmedInput = input.trim();

      if (!trimmedInput) {
        return {
          success: false,
          error: ERROR_MESSAGES.EMPTY_INPUT,
        };
      }

      const parts = trimmedInput.split(' ');

      if (parts.length !== GAME_CONSTANTS.VALIDATION.CHALLENGE_3_INPUT_PARTS) {
        return {
          success: false,
          error: `${ERROR_MESSAGES.INVALID_INPUT_FORMAT}. Expected format: "shot_type timing"`,
        };
      }

      const [shotType, shotTiming] = parts;

      // Validate shot type
      if (!this.isValidShotType(shotType)) {
        return {
          success: false,
          error: `${ERROR_MESSAGES.INVALID_SHOT_TYPE}: ${shotType}`,
        };
      }

      // Validate shot timing
      if (!this.isValidShotTiming(shotTiming)) {
        return {
          success: false,
          error: `${ERROR_MESSAGES.INVALID_SHOT_TIMING}: ${shotTiming}`,
        };
      }

      return {
        success: true,
        data: {
          shotType: shotType as ShotType,
          shotTiming: shotTiming as ShotTiming,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  parseMultiple(inputs: string[]): InputParseResult<SuperOverShotInput[]> {
    const nonEmptyInputs = inputs.filter(line => line.trim());

    if (nonEmptyInputs.length !== GAME_CONSTANTS.SUPER_OVER.TOTAL_BALLS) {
      return {
        success: false,
        error: ERROR_MESSAGES.INVALID_SUPER_OVER_INPUT,
      };
    }

    const results: SuperOverShotInput[] = [];
    const errors: string[] = [];

    for (let i = 0; i < nonEmptyInputs.length; i++) {
      const parseResult = this.parse(nonEmptyInputs[i]);
      if (parseResult.success && parseResult.data) {
        results.push(parseResult.data);
      } else {
        errors.push(`Ball ${i + 1}: ${parseResult.error}`);
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        error: errors.join('\n'),
      };
    }

    return {
      success: true,
      data: results,
    };
  }

  validate(input: string): boolean {
    const result = this.parse(input);
    return result.success;
  }

  private isValidShotType(shotType: string): boolean {
    return this.validShotTypes.has(shotType);
  }

  private isValidShotTiming(shotTiming: string): boolean {
    return this.validShotTimings.has(shotTiming);
  }

  getValidShotTypes(): string[] {
    return Array.from(this.validShotTypes);
  }

  getValidShotTimings(): string[] {
    return Array.from(this.validShotTimings);
  }
}
