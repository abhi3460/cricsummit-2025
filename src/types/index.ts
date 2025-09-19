/**
 * Core types for the Cricket Outcome Prediction System
 * CRICSUMMIT'25 Challenge Implementation
 */

export type BowlingType =
  | 'Bouncer'
  | 'Inswinger'
  | 'Outswinger'
  | 'Leg Cutter'
  | 'Off Cutter'
  | 'Slower Ball'
  | 'Yorker'
  | 'Pace'
  | 'Off Break'
  | 'Doosra';

export type ShotType =
  | 'Straight'
  | 'Flick'
  | 'Long On'
  | 'SquareCut'
  | 'Sweep'
  | 'CoverDrive'
  | 'Pull'
  | 'Scoop'
  | 'LegGlance'
  | 'UpperCut';

export type ShotTiming = 'Early' | 'Good' | 'Perfect' | 'Late';

export type ShotOutcome =
  | '1 run'
  | '2 runs'
  | '3 runs'
  | '4 runs'
  | '5 runs'
  | '6 runs'
  | '1 wicket';

export type CommentaryType =
  | 'wicket'
  | 'excellent-line-length'
  | 'edged-taken'
  | 'huge-hit'
  | 'just-over-fielder'
  | 'excellent-boundary-effort'
  | 'convert-ones-twos'
  | 'massive-out-ground'
  | 'excellent-running';

export interface CricketInput {
  bowlingType: BowlingType;
  shotType: ShotType;
  shotTiming: ShotTiming;
}

export interface CricketOutput {
  outcome: ShotOutcome;
  commentary?: CommentaryType;
}

export interface OutcomeRule {
  bowlingType: BowlingType;
  shotType: ShotType;
  timingOutcomes: {
    [K in ShotTiming]: ShotOutcome;
  };
}
