/**
 * Cricket Application for CRICSUMMIT'25
 * Uses dependency injection and modular architecture
 */

import {
  DependencyContainer,
  IDependencyContainer,
  StrategyType,
} from '../container/dependency-container';
import {
  InputValidationError,
  SuperOverError,
  CricketError,
} from '../errors/cricket-errors';

export interface ICricketApp {
  runChallenge1(input: string): string[];
  runChallenge2(input: string): string[];
  runChallenge3(input: string): string[];
  setOutcomeStrategy(strategy: StrategyType): void;
  getCurrentStrategy(): StrategyType;
  getAvailableStrategies(): StrategyType[];
  displaySamples(): void;
  getSampleInput(challenge: number): string[];
}

export class CricketApp implements ICricketApp {
  private container: IDependencyContainer;

  constructor(container?: IDependencyContainer) {
    this.container = container || new DependencyContainer();
  }

  runChallenge1(input: string): string[] {
    try {
      const service = this.container.getChallenge1Service();
      const outcomes = service.processInput(input);
      return outcomes;
    } catch (error) {
      return this.handleError(error, 'Challenge 1');
    }
  }

  runChallenge2(input: string): string[] {
    try {
      const service = this.container.getChallenge2Service();
      const outputs = service.processInput(input);
      return service.formatOutput(outputs);
    } catch (error) {
      return this.handleError(error, 'Challenge 2');
    }
  }

  runChallenge3(input: string): string[] {
    try {
      const service = this.container.getChallenge3Service();
      return service.processInput(input);
    } catch (error) {
      return this.handleError(error, 'Challenge 3');
    }
  }

  setOutcomeStrategy(strategy: StrategyType): void {
    this.container.setOutcomeStrategy(strategy);
  }

  getCurrentStrategy(): StrategyType {
    return this.container.getCurrentStrategy();
  }

  getAvailableStrategies(): StrategyType[] {
    return this.container.getAvailableStrategies();
  }

  getStrategyInfo(strategyType?: StrategyType): {
    name: string;
    description: string;
  } {
    return this.container.getStrategyInfo(strategyType);
  }

  displaySamples(): void {
    console.log("🏏 CRICSUMMIT'25 - Sample Inputs and Outputs\n");

    this.displayChallenge1Samples();
    this.displayChallenge2Samples();
    this.displayChallenge3Samples();
    this.displayStrategyInfo();
  }

  private displayChallenge1Samples(): void {
    console.log('📊 Challenge #1: Predict Outcome');
    console.log('================================');

    const service = this.container.getChallenge1Service();
    const sampleInputs = service.getSampleInput();
    const sampleOutputs = service.getSampleOutput();

    console.log('Input:');
    sampleInputs.forEach(input => console.log(`  ${input}`));

    console.log('\nOutput:');
    sampleOutputs.forEach(output => console.log(`  ${output}`));
    console.log();
  }

  private displayChallenge2Samples(): void {
    console.log('🎙️  Challenge #2: Commentary');
    console.log('============================');

    const service = this.container.getChallenge2Service();
    const sampleInputs = service.getSampleInput();
    const sampleOutputs = service.getSampleOutput();

    console.log('Input:');
    sampleInputs.forEach(input => console.log(`  ${input}`));

    console.log('\nOutput:');
    sampleOutputs.forEach(output =>
      console.log(`  ${output.commentary} - ${output.outcome}`)
    );
    console.log();
  }

  private displayChallenge3Samples(): void {
    console.log('🏆 Challenge #3: Super Over');
    console.log('===========================');

    const service = this.container.getChallenge3Service();
    const sampleInputs = service.getSampleInput();

    console.log('Input:');
    sampleInputs.forEach(input => console.log(`  ${input}`));

    console.log('\nOutput:');
    console.log('  (Simulated Super Over match with ball-by-ball commentary)');
    console.log();
  }

  private displayStrategyInfo(): void {
    console.log('🧠 Available Strategies');
    console.log('=======================');

    const availableStrategies = this.getAvailableStrategies();
    const currentStrategy = this.getCurrentStrategy();

    availableStrategies.forEach(strategy => {
      const info = this.container.getStrategyInfo(strategy);
      const current = strategy === currentStrategy ? ' (CURRENT)' : '';
      console.log(`📈 ${info.name}${current}`);
      console.log(`   ${info.description}`);
      console.log();
    });
  }

  private handleError(error: unknown, context: string): string[] {
    let errorMessage: string;

    if (error instanceof InputValidationError) {
      errorMessage = `❌ Input Validation Error in ${context}: ${error.message}`;
    } else if (error instanceof SuperOverError) {
      errorMessage = `❌ Super Over Error in ${context}: ${error.message}`;
    } else if (error instanceof CricketError) {
      errorMessage = `❌ Cricket Error in ${context}: ${error.message}`;
    } else {
      errorMessage = `❌ Unexpected Error in ${context}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

    console.error(errorMessage);

    if (error instanceof CricketError && error.context) {
      console.error('Error Context:', error.context);
    }

    return [errorMessage];
  }

  // Additional utility methods
  validateChallenge1Input(input: string): boolean {
    try {
      const service = this.container.getChallenge1Service();
      return service.validateInput(input);
    } catch {
      return false;
    }
  }

  validateChallenge2Input(input: string): boolean {
    try {
      const service = this.container.getChallenge2Service();
      return service.validateInput(input);
    } catch {
      return false;
    }
  }

  validateChallenge3Input(input: string): boolean {
    try {
      const service = this.container.getChallenge3Service();
      return service.validateInput(input);
    } catch {
      return false;
    }
  }

  getValidInputFormats(): {
    challenge1: {
      bowlingTypes: string[];
      shotTypes: string[];
      shotTimings: string[];
    };
    challenge2: {
      bowlingTypes: string[];
      shotTypes: string[];
      shotTimings: string[];
    };
    challenge3: { shotTypes: string[]; shotTimings: string[] };
  } {
    const challenge1Service = this.container.getChallenge1Service();
    const challenge2Service = this.container.getChallenge2Service();
    const challenge3Service = this.container.getChallenge3Service();

    return {
      challenge1: challenge1Service.getValidInputFormats(),
      challenge2: challenge2Service.getValidInputFormats(),
      challenge3: challenge3Service.getValidInputFormats(),
    };
  }

  getSampleInput(challenge: number): string[] {
    switch (challenge) {
      case 1:
        return this.container.getChallenge1Service().getSampleInput();
      case 2:
        return this.container.getChallenge2Service().getSampleInput();
      case 3:
        return this.container.getChallenge3Service().getSampleInput();
      default:
        throw new Error(`Invalid challenge number: ${challenge}`);
    }
  }
}
