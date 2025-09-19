/**
 * Cricket Input Parser
 * Handles parsing and validation of cricket input data
 */

import { BowlingType, ShotType, ShotTiming, CricketInput } from '../types';
import { ERROR_MESSAGES } from '../constants/game-rules';
import { IInputParser, InputParseResult } from './input-parser.interface';

export class CricketInputParser implements IInputParser<CricketInput> {
  private readonly validBowlingTypes: Set<string>;
  private readonly validShotTypes: Set<string>;
  private readonly validShotTimings: Set<string>;

  constructor() {
    this.validBowlingTypes = new Set([
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
    ]);

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

  parse(input: string): InputParseResult<CricketInput> {
    try {
      const trimmedInput = input.trim();

      if (!trimmedInput) {
        return {
          success: false,
          error: ERROR_MESSAGES.EMPTY_INPUT,
        };
      }

      // Parse the input considering multi-word terms
      const parseResult = this.parseInputWithMultiWordTypes(trimmedInput);
      if (!parseResult.success) {
        // Try to give more specific error messages for validation issues
        const words = trimmedInput.split(' ');
        if (words.length >= 1 && !this.isValidBowlingType(words[0])) {
          return {
            success: false,
            error: `${ERROR_MESSAGES.INVALID_BOWLING_TYPE}: ${words[0]}`,
          };
        }
        if (words.length >= 2 && !this.isValidShotType(words[1])) {
          return {
            success: false,
            error: `${ERROR_MESSAGES.INVALID_SHOT_TYPE}: ${words[1]}`,
          };
        }
        if (words.length >= 3 && !this.isValidShotTiming(words[2])) {
          return {
            success: false,
            error: `${ERROR_MESSAGES.INVALID_SHOT_TIMING}: ${words[2]}`,
          };
        }
        return parseResult;
      }

      const { bowlingType, shotType, shotTiming } = parseResult.data!;

      // Validate that the parsed values are actually valid (final check)
      if (!this.isValidBowlingType(bowlingType)) {
        return {
          success: false,
          error: `${ERROR_MESSAGES.INVALID_BOWLING_TYPE}: ${bowlingType}`,
        };
      }

      if (!this.isValidShotType(shotType)) {
        return {
          success: false,
          error: `${ERROR_MESSAGES.INVALID_SHOT_TYPE}: ${shotType}`,
        };
      }

      if (!this.isValidShotTiming(shotTiming)) {
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
    } catch (error) {
      return {
        success: false,
        error: `Parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  parseMultiple(inputs: string[]): InputParseResult<CricketInput[]> {
    const results: CricketInput[] = [];
    const errors: string[] = [];

    for (let i = 0; i < inputs.length; i++) {
      const line = inputs[i].trim();
      if (!line) continue; // Skip empty lines

      const parseResult = this.parse(line);
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

    return {
      success: true,
      data: results,
    };
  }

  validate(input: string): boolean {
    const result = this.parse(input);
    return result.success;
  }

  private isValidBowlingType(bowlingType: string): boolean {
    return this.validBowlingTypes.has(bowlingType);
  }

  private isValidShotType(shotType: string): boolean {
    return this.validShotTypes.has(shotType);
  }

  private isValidShotTiming(shotTiming: string): boolean {
    return this.validShotTimings.has(shotTiming);
  }

  getValidBowlingTypes(): string[] {
    return Array.from(this.validBowlingTypes);
  }

  getValidShotTypes(): string[] {
    return Array.from(this.validShotTypes);
  }

  getValidShotTimings(): string[] {
    return Array.from(this.validShotTimings);
  }

  private parseInputWithMultiWordTypes(
    input: string
  ): InputParseResult<CricketInput> {
    const words = input.split(' ');

    // Try to match bowling types from longest to shortest
    const bowlingTypesArray = Array.from(this.validBowlingTypes).sort(
      (a, b) => b.length - a.length
    );

    for (const bowlingType of bowlingTypesArray) {
      const bowlingWords = bowlingType.split(' ');
      if (words.length >= bowlingWords.length + 2) {
        // bowling + shot + timing
        const bowlingPart = words.slice(0, bowlingWords.length).join(' ');
        if (bowlingPart === bowlingType) {
          const remainingWords = words.slice(bowlingWords.length);
          if (remainingWords.length >= 2) {
            // Try to match shot types from longest to shortest
            const shotTypesArray = Array.from(this.validShotTypes).sort(
              (a, b) => b.length - a.length
            );

            for (const shotType of shotTypesArray) {
              const shotWords = shotType.split(' ');
              if (remainingWords.length >= shotWords.length + 1) {
                // shot + timing
                const shotPart = remainingWords
                  .slice(0, shotWords.length)
                  .join(' ');
                if (shotPart === shotType) {
                  const timingWords = remainingWords.slice(shotWords.length);
                  if (
                    timingWords.length === 1 &&
                    this.isValidShotTiming(timingWords[0])
                  ) {
                    return {
                      success: true,
                      data: {
                        bowlingType: bowlingType as BowlingType,
                        shotType: shotType as ShotType,
                        shotTiming: timingWords[0] as ShotTiming,
                      },
                    };
                  }
                }
              }
            }
          }
        }
      }
    }

    return {
      success: false,
      error: `${ERROR_MESSAGES.INVALID_INPUT_FORMAT}. Expected format: "bowling_type shot_type timing"`,
    };
  }
}
