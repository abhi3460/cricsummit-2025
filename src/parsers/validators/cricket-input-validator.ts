/**
 * Cricket Input Validator
 * Handles validation of cricket input components (bowling types, shot types, timing)
 */

import { BowlingType, ShotType, ShotTiming } from '../../types';

interface CricketInputValidationSets {
  bowlingTypes: Set<BowlingType>;
  shotTypes: Set<ShotType>;
  shotTimings: Set<ShotTiming>;
}

/**
 * Creates and manages validation sets for cricket input components
 */
export class CricketInputValidator {
  private readonly validationSets: CricketInputValidationSets;

  constructor() {
    this.validationSets = {
      bowlingTypes: new Set<BowlingType>([
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
      ]),
      shotTypes: new Set<ShotType>([
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
      ]),
      shotTimings: new Set<ShotTiming>(['Early', 'Good', 'Perfect', 'Late']),
    };
  }

  /**
   * Validates if a bowling type is valid
   */
  isValidBowlingType(bowlingType: string): bowlingType is BowlingType {
    return this.validationSets.bowlingTypes.has(bowlingType as BowlingType);
  }

  /**
   * Validates if a shot type is valid
   */
  isValidShotType(shotType: string): shotType is ShotType {
    return this.validationSets.shotTypes.has(shotType as ShotType);
  }

  /**
   * Validates if a shot timing is valid
   */
  isValidShotTiming(shotTiming: string): shotTiming is ShotTiming {
    return this.validationSets.shotTimings.has(shotTiming as ShotTiming);
  }

  /**
   * Gets all valid bowling types as array
   */
  getValidBowlingTypes(): BowlingType[] {
    return Array.from(this.validationSets.bowlingTypes);
  }

  /**
   * Gets all valid shot types as array
   */
  getValidShotTypes(): ShotType[] {
    return Array.from(this.validationSets.shotTypes);
  }

  /**
   * Gets all valid shot timings as array
   */
  getValidShotTimings(): ShotTiming[] {
    return Array.from(this.validationSets.shotTimings);
  }

  /**
   * Validates a complete cricket input structure
   */
  validateInput(
    bowlingType: string,
    shotType: string,
    shotTiming: string
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!this.isValidBowlingType(bowlingType)) {
      errors.push(`Invalid bowling type: ${bowlingType}`);
    }

    if (!this.isValidShotType(shotType)) {
      errors.push(`Invalid shot type: ${shotType}`);
    }

    if (!this.isValidShotTiming(shotTiming)) {
      errors.push(`Invalid shot timing: ${shotTiming}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Gets validation statistics
   */
  getValidationStats(): {
    bowlingTypeCount: number;
    shotTypeCount: number;
    shotTimingCount: number;
    totalCombinations: number;
  } {
    return {
      bowlingTypeCount: this.validationSets.bowlingTypes.size,
      shotTypeCount: this.validationSets.shotTypes.size,
      shotTimingCount: this.validationSets.shotTimings.size,
      totalCombinations:
        this.validationSets.bowlingTypes.size *
        this.validationSets.shotTypes.size *
        this.validationSets.shotTimings.size,
    };
  }
}
