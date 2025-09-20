/**
 * Commentary Output Formatter
 * Handles formatting of commentary output
 */

import { ShotOutcome } from '../types';
import { IOutputFormatter } from './output-formatter.interface';

export interface CommentaryOutput {
  commentary: string;
  outcome: ShotOutcome;
}

export class CommentaryFormatter implements IOutputFormatter<CommentaryOutput> {
  format(data: CommentaryOutput): string {
    return `${data.commentary} - ${data.outcome}`;
  }

  formatMultiple(data: CommentaryOutput[]): string[] {
    return data.map(output => this.format(output));
  }

  formatForDisplay(data: CommentaryOutput[]): string {
    return this.formatMultiple(data).join('\n');
  }
}
