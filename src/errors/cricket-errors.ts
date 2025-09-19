/**
 * Cricket Error Classes
 * Centralized error handling for the cricket prediction system
 */

export class CricketError extends Error {
  public readonly code: string;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'CricketError';
    this.code = code;
    this.context = context;
  }
}

export class InputValidationError extends CricketError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'INPUT_VALIDATION_ERROR', context);
    this.name = 'InputValidationError';
  }
}

export class OutcomePredictionError extends CricketError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'OUTCOME_PREDICTION_ERROR', context);
    this.name = 'OutcomePredictionError';
  }
}

export class CommentaryGenerationError extends CricketError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'COMMENTARY_GENERATION_ERROR', context);
    this.name = 'CommentaryGenerationError';
  }
}

export class SuperOverError extends CricketError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'SUPER_OVER_ERROR', context);
    this.name = 'SuperOverError';
  }
}

export class ConfigurationError extends CricketError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'CONFIGURATION_ERROR', context);
    this.name = 'ConfigurationError';
  }
}
