/**
 * Commentary Rules Configuration
 * Centralized configuration for cricket commentary generation
 */

import { ShotOutcome, CommentaryType } from '../types';

interface CommentaryRule {
  outcome: ShotOutcome;
  commentaryType: CommentaryType;
  text: string;
}

const COMMENTARY_RULES: CommentaryRule[] = [
  {
    outcome: '0 runs',
    commentaryType: 'dot-ball',
    text: 'Dot ball, no run.',
  },
  {
    outcome: '1 wicket',
    commentaryType: 'wicket',
    text: "It's a wicket!",
  },
  {
    outcome: '1 run',
    commentaryType: 'single-run',
    text: 'Quick single taken.',
  },
  {
    outcome: '2 runs',
    commentaryType: 'excellent-running',
    text: 'Excellent running between the wickets.',
  },
  {
    outcome: '3 runs',
    commentaryType: 'just-over-fielder',
    text: 'Just over the fielder.',
  },
  {
    outcome: '4 runs',
    commentaryType: 'excellent-line-length',
    text: 'Excellent line and length.',
  },
  {
    outcome: '5 runs',
    commentaryType: 'excellent-boundary-effort',
    text: 'Excellent effort on the boundary.',
  },
  {
    outcome: '6 runs',
    commentaryType: 'massive-out-ground',
    text: "That's massive and out of the ground.",
  },
];

const DEFAULT_COMMENTARY = {
  commentaryType: 'excellent-line-length' as CommentaryType,
  text: 'Excellent line and length.',
};

/**
 * Get commentary rule for specific outcome
 */
export function getCommentaryRule(outcome: ShotOutcome): CommentaryRule {
  const rule = COMMENTARY_RULES.find(rule => rule.outcome === outcome);
  return (
    rule || {
      outcome,
      ...DEFAULT_COMMENTARY,
    }
  );
}
