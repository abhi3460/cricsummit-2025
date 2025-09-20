/**
 * Swing Bowling Outcome Rules
 * Rules for Inswinger and Outswinger bowling types
 */

import { OutcomeRule } from '../../types';

export const SWING_BOWLING_RULES: OutcomeRule[] = [
  // Inswinger combinations
  {
    bowlingType: 'Inswinger',
    shotType: 'Flick',
    timingOutcomes: {
      Early: '1 run',
      Good: '3 runs',
      Perfect: '4 runs',
      Late: '2 runs',
    },
  },
  {
    bowlingType: 'Inswinger',
    shotType: 'Straight',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '3 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Inswinger',
    shotType: 'LegGlance',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '3 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Inswinger',
    shotType: 'Pull',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },

  // Outswinger combinations
  {
    bowlingType: 'Outswinger',
    shotType: 'CoverDrive',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Outswinger',
    shotType: 'Pull',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Outswinger',
    shotType: 'Sweep',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Outswinger',
    shotType: 'Straight',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '3 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Outswinger',
    shotType: 'SquareCut',
    timingOutcomes: {
      Early: '1 run',
      Good: '3 runs',
      Perfect: '4 runs',
      Late: '2 runs',
    },
  },
  {
    bowlingType: 'Outswinger',
    shotType: 'UpperCut',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Outswinger',
    shotType: 'Long On',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
];
