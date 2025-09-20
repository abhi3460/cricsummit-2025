/**
 * Game Rules and Constants
 * Centralized configuration for cricket game rules
 */

export const GAME_CONSTANTS = {
  SUPER_OVER: {
    TOTAL_BALLS: 6,
    MAX_WICKETS: 2,
    TARGET_RUNS: 20, // Fixed target as per challenge requirements
  },
  PLAYERS: {
    DEFAULT_BOWLER: 'Brett Lee',
    DEFAULT_BATSMAN: 'Rahul Dravid', // My favorite batsman
    DEFAULT_TEAM: 'INDIA',
  },
  VALIDATION: {
    MIN_INPUT_PARTS: 2,
    CHALLENGE_1_INPUT_PARTS: 3,
    CHALLENGE_2_INPUT_PARTS: 3,
    CHALLENGE_3_INPUT_PARTS: 2,
  },
} as const;

export const ERROR_MESSAGES = {
  INVALID_INPUT_FORMAT: 'Invalid input format',
  INSUFFICIENT_INPUT_PARTS: 'Insufficient input parts',
  INVALID_BOWLING_TYPE: 'Invalid bowling type',
  INVALID_SHOT_TYPE: 'Invalid shot type',
  INVALID_SHOT_TIMING: 'Invalid shot timing',
  INVALID_SUPER_OVER_INPUT: 'Super Over requires exactly 6 shot inputs',
  EMPTY_INPUT: 'Input cannot be empty',
  PARSING_ERROR: 'Error parsing input',
  NO_VALID_INPUTS: 'No valid inputs found',
} as const;
