/**
 * Output Formatter Interface
 * Defines the contract for output formatting
 */

export interface IOutputFormatter<T> {
  format(data: T): string;
  formatMultiple(data: T[]): string[];
}
