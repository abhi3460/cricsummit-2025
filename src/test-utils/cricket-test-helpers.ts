/**
 * Cricket Test Helpers
 * Utility functions and helpers for comprehensive testing
 */

import {
  BowlingType,
  ShotType,
  ShotTiming,
  CricketInput,
  ShotOutcome,
} from '../types';
import { CricketApp } from '../app/cricket-app';
import { DependencyContainer } from '../container/dependency-container';

/**
 * Test data generators for cricket scenarios
 */
export class CricketTestDataGenerator {
  private static readonly BOWLING_TYPES: BowlingType[] = [
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

  private static readonly SHOT_TYPES: ShotType[] = [
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
  ];

  private static readonly SHOT_TIMINGS: ShotTiming[] = [
    'Early',
    'Good',
    'Perfect',
    'Late',
  ];

  /**
   * Generates a valid cricket input
   */
  static generateValidInput(): CricketInput {
    return {
      bowlingType: this.getRandomElement(this.BOWLING_TYPES),
      shotType: this.getRandomElement(this.SHOT_TYPES),
      shotTiming: this.getRandomElement(this.SHOT_TIMINGS),
    };
  }

  /**
   * Generates multiple valid cricket inputs
   */
  static generateValidInputs(count: number): CricketInput[] {
    return Array.from({ length: count }, () => this.generateValidInput());
  }

  /**
   * Generates input string from cricket input object
   */
  static inputToString(input: CricketInput): string {
    return `${input.bowlingType} ${input.shotType} ${input.shotTiming}`;
  }

  /**
   * Generates multiple input strings
   */
  static generateInputStrings(count: number): string[] {
    return this.generateValidInputs(count).map(input =>
      this.inputToString(input)
    );
  }

  /**
   * Generates invalid bowling type inputs for testing
   */
  static generateInvalidBowlingInputs(): string[] {
    return [
      'InvalidBowl Pull Perfect',
      'FastBall Straight Good',
      'Spinner Sweep Late',
      'Mystery UpperCut Early',
    ];
  }

  /**
   * Generates invalid shot type inputs for testing
   */
  static generateInvalidShotInputs(): string[] {
    return [
      'Bouncer InvalidShot Perfect',
      'Yorker Hit Good',
      'Pace Strike Late',
      'Off Break Smash Early',
    ];
  }

  /**
   * Generates invalid timing inputs for testing
   */
  static generateInvalidTimingInputs(): string[] {
    return [
      'Bouncer Pull Fast',
      'Yorker Straight Slow',
      'Pace CoverDrive Quick',
      'Off Break Sweep Bad',
    ];
  }

  /**
   * Generates malformed inputs for testing
   */
  static generateMalformedInputs(): string[] {
    return [
      '',
      '   ',
      'OnlyOne',
      'Only Two',
      'Too Many Words Here Extra',
      'Bouncer  Pull  Perfect', // Extra spaces
      'bouncer pull perfect', // Wrong case
      'Bouncer-Pull-Perfect', // Wrong separators
    ];
  }

  /**
   * Generates unrealistic combinations for testing
   */
  static generateUnrealisticCombinations(): string[] {
    return [
      'Bouncer Sweep Perfect',
      'Yorker UpperCut Good',
      'Doosra Scoop Late',
      'Leg Cutter Scoop Perfect',
    ];
  }

  /**
   * Gets all valid bowling types
   */
  static getAllBowlingTypes(): BowlingType[] {
    return [...this.BOWLING_TYPES];
  }

  /**
   * Gets all valid shot types
   */
  static getAllShotTypes(): ShotType[] {
    return [...this.SHOT_TYPES];
  }

  /**
   * Gets all valid shot timings
   */
  static getAllShotTimings(): ShotTiming[] {
    return [...this.SHOT_TIMINGS];
  }

  private static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
}

/**
 * Test assertion helpers for cricket-specific testing
 */
export class CricketTestAssertions {
  /**
   * Asserts that an outcome is valid
   */
  static assertValidOutcome(outcome: string): asserts outcome is ShotOutcome {
    const validOutcomes: ShotOutcome[] = [
      '1 run',
      '2 runs',
      '3 runs',
      '4 runs',
      '5 runs',
      '6 runs',
      '1 wicket',
    ];

    if (!validOutcomes.includes(outcome as ShotOutcome)) {
      throw new Error(
        `Invalid outcome: ${outcome}. Expected one of: ${validOutcomes.join(', ')}`
      );
    }
  }

  /**
   * Asserts that an outcome is a run outcome (not a wicket)
   */
  static assertRunOutcome(outcome: ShotOutcome): void {
    if (outcome === '1 wicket') {
      throw new Error(`Expected run outcome, got wicket: ${outcome}`);
    }
  }

  /**
   * Asserts that an outcome is a wicket
   */
  static assertWicketOutcome(outcome: ShotOutcome): void {
    if (outcome !== '1 wicket') {
      throw new Error(`Expected wicket outcome, got run: ${outcome}`);
    }
  }

  /**
   * Asserts that an outcome is a boundary (4 or 6 runs)
   */
  static assertBoundaryOutcome(outcome: ShotOutcome): void {
    if (outcome !== '4 runs' && outcome !== '6 runs') {
      throw new Error(
        `Expected boundary outcome (4 or 6 runs), got: ${outcome}`
      );
    }
  }

  /**
   * Asserts that runs are within expected range
   */
  static assertRunsInRange(
    outcome: ShotOutcome,
    min: number,
    max: number
  ): void {
    if (outcome === '1 wicket') {
      throw new Error(`Expected run outcome, got wicket`);
    }

    const runs = parseInt(outcome.split(' ')[0]);
    if (runs < min || runs > max) {
      throw new Error(`Expected runs between ${min} and ${max}, got: ${runs}`);
    }
  }
}

/**
 * Test scenario builders for complex testing scenarios
 */
export class CricketTestScenarioBuilder {
  private inputs: string[] = [];
  private expectedOutcomes: ShotOutcome[] = [];
  private description: string = '';

  /**
   * Sets scenario description
   */
  withDescription(description: string): CricketTestScenarioBuilder {
    this.description = description;
    return this;
  }

  /**
   * Adds input with expected outcome
   */
  addInput(
    input: string,
    expectedOutcome?: ShotOutcome
  ): CricketTestScenarioBuilder {
    this.inputs.push(input);
    if (expectedOutcome) {
      this.expectedOutcomes.push(expectedOutcome);
    }
    return this;
  }

  /**
   * Adds multiple inputs
   */
  addInputs(inputs: string[]): CricketTestScenarioBuilder {
    this.inputs.push(...inputs);
    return this;
  }

  /**
   * Builds the scenario
   */
  build(): {
    description: string;
    inputs: string[];
    expectedOutcomes: ShotOutcome[];
    inputString: string;
  } {
    return {
      description: this.description,
      inputs: [...this.inputs],
      expectedOutcomes: [...this.expectedOutcomes],
      inputString: this.inputs.join('\n'),
    };
  }
}

/**
 * Mock factory for creating test doubles
 */
export class CricketTestMockFactory {
  /**
   * Creates a mock cricket app with predictable behavior
   */
  static createMockCricketApp(
    challenge1Results?: string[],
    challenge2Results?: string[],
    challenge3Results?: string[]
  ): Partial<CricketApp> {
    return {
      runChallenge1: jest.fn().mockReturnValue(challenge1Results || ['6 runs']),
      runChallenge2: jest
        .fn()
        .mockReturnValue(
          challenge2Results || [
            "That's massive and out of the ground. - 6 runs",
          ]
        ),
      runChallenge3: jest
        .fn()
        .mockReturnValue(
          challenge3Results || [
            'AUSTRALIA scored: 18 runs',
            'AUSTRALIA won by 2 wickets',
          ]
        ),
      getSampleInput: jest.fn().mockReturnValue(['Bouncer Pull Perfect']),
    };
  }

  /**
   * Creates a mock dependency container
   */
  static createMockContainer(): Partial<DependencyContainer> {
    return {
      getCurrentStrategy: jest.fn().mockReturnValue('rule-based'),
      setOutcomeStrategy: jest.fn(),
      getAvailableStrategies: jest
        .fn()
        .mockReturnValue(['rule-based', 'probabilistic']),
    };
  }
}

/**
 * Performance testing utilities
 */
export class CricketPerformanceTestUtils {
  /**
   * Measures execution time of a function
   */
  static async measureExecutionTime<T>(
    fn: () => Promise<T> | T,
    iterations: number = 1
  ): Promise<{ result: T; averageTime: number; totalTime: number }> {
    const results: T[] = [];
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      const result = await Promise.resolve(fn());
      const end = performance.now();

      results.push(result);
      times.push(end - start);
    }

    return {
      result: results[results.length - 1],
      averageTime: times.reduce((sum, time) => sum + time, 0) / times.length,
      totalTime: times.reduce((sum, time) => sum + time, 0),
    };
  }

  /**
   * Tests parsing performance with various input sizes
   */
  static createPerformanceTestSuite(
    inputSizes: number[] = [1, 10, 100, 1000]
  ): Array<{
    size: number;
    inputs: string[];
    description: string;
  }> {
    return inputSizes.map(size => ({
      size,
      inputs: CricketTestDataGenerator.generateInputStrings(size),
      description: `Performance test with ${size} inputs`,
    }));
  }
}
