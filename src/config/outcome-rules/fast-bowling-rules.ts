/**
 * Fast Bowling Outcome Rules
 * Rules for Bouncer, Yorker, and Pace bowling types
 */

import { OutcomeRule } from '../../types';

export const FAST_BOWLING_RULES: OutcomeRule[] = [
  // Bouncer ball combinations
  {
    bowlingType: 'Bouncer',
    shotType: 'Pull',
    timingOutcomes: {
      Early: '2 runs',
      Good: '4 runs',
      Perfect: '6 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Bouncer',
    shotType: 'UpperCut',
    timingOutcomes: {
      Early: '1 run',
      Good: '4 runs',
      Perfect: '6 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Bouncer',
    shotType: 'Straight',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Bouncer',
    shotType: 'Sweep',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },

  // Yorker combinations
  {
    bowlingType: 'Yorker',
    shotType: 'Straight',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Yorker',
    shotType: 'Flick',
    timingOutcomes: {
      Early: '1 run',
      Good: '3 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Yorker',
    shotType: 'Scoop',
    timingOutcomes: {
      Early: '1 wicket',
      Good: '4 runs',
      Perfect: '6 runs',
      Late: '1 wicket',
    },
  },

  // Pace ball combinations
  {
    bowlingType: 'Pace',
    shotType: 'Straight',
    timingOutcomes: {
      Early: '1 run',
      Good: '3 runs',
      Perfect: '4 runs',
      Late: '2 runs',
    },
  },
  {
    bowlingType: 'Pace',
    shotType: 'CoverDrive',
    timingOutcomes: {
      Early: '1 run',
      Good: '3 runs',
      Perfect: '4 runs',
      Late: '2 runs',
    },
  },
  {
    bowlingType: 'Pace',
    shotType: 'Pull',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
  {
    bowlingType: 'Pace',
    shotType: 'SquareCut',
    timingOutcomes: {
      Early: '1 run',
      Good: '3 runs',
      Perfect: '4 runs',
      Late: '2 runs',
    },
  },
  {
    bowlingType: 'Pace',
    shotType: 'Long On',
    timingOutcomes: {
      Early: '1 run',
      Good: '2 runs',
      Perfect: '4 runs',
      Late: '1 wicket',
    },
  },
];
