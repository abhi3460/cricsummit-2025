/**
 * Input Parser Interface
 * Defines the contract for input parsing
 */

export interface InputParseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface IInputParser<T> {
  parse(input: string): InputParseResult<T>;
  parseMultiple(inputs: string[]): InputParseResult<T[]>;
  validate(input: string): boolean;
}
