/**
 * Commentary Engine for CRICSUMMIT'25
 * Uses configuration-based rules for commentary generation
 */

import { ShotOutcome, CommentaryType } from '../types';
import { getCommentaryRule } from '../config/commentary-rules';
import { CommentaryGenerationError } from '../errors/cricket-errors';

export interface ICommentaryEngine {
  getCommentary(outcome: ShotOutcome): CommentaryType;
  getCommentaryText(outcome: ShotOutcome): string;
  formatCommentary(commentaryType: CommentaryType): string;
}

export class CommentaryEngine implements ICommentaryEngine {
  getCommentary(outcome: ShotOutcome): CommentaryType {
    try {
      const rule = getCommentaryRule(outcome);
      return rule.commentaryType;
    } catch (error) {
      throw new CommentaryGenerationError(
        `Failed to generate commentary for outcome: ${outcome}`,
        {
          outcome,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      );
    }
  }

  getCommentaryText(outcome: ShotOutcome): string {
    try {
      const rule = getCommentaryRule(outcome);
      return rule.text;
    } catch (error) {
      throw new CommentaryGenerationError(
        `Failed to get commentary text for outcome: ${outcome}`,
        {
          outcome,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      );
    }
  }

  formatCommentary(commentaryType: CommentaryType): string {
    // This method can be extended to format commentary based on type
    // For now, it returns the commentary type as string
    return commentaryType
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  generateCommentaryWithOutcome(outcome: ShotOutcome): {
    commentary: string;
    outcome: ShotOutcome;
  } {
    const commentary = this.getCommentaryText(outcome);
    return {
      commentary,
      outcome,
    };
  }
}
