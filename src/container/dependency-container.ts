/**
 * Dependency Injection Container
 * Manages all dependencies and their lifecycles
 */

import { OutcomeEngine, IOutcomeEngine } from '../engines/outcome-engine';
import {
  CommentaryEngine,
  ICommentaryEngine,
} from '../engines/commentary-engine';
import { RuleBasedOutcomeStrategy } from '../strategies/rule-based-outcome-strategy';
import { ProbabilisticOutcomeStrategy } from '../strategies/probabilistic-outcome-strategy';
import { CricketInputParser } from '../parsers/cricket-input-parser';
import { SuperOverParser } from '../parsers/super-over-parser';
import { CommentaryFormatter } from '../formatters/commentary-formatter';
import { SuperOverFormatter } from '../formatters/super-over-formatter';
import {
  Challenge1Service,
  IChallenge1Service,
} from '../services/challenge1-service';
import {
  Challenge2Service,
  IChallenge2Service,
} from '../services/challenge2-service';
import {
  Challenge3Service,
  IChallenge3Service,
} from '../services/challenge3-service';
import { IOutcomeStrategy } from '../strategies/outcome-strategy.interface';

export type StrategyType = 'rule-based' | 'probabilistic';

export interface IDependencyContainer {
  getChallenge1Service(): IChallenge1Service;
  getChallenge2Service(): IChallenge2Service;
  getChallenge3Service(): IChallenge3Service;
  getOutcomeEngine(): IOutcomeEngine;
  getCommentaryEngine(): ICommentaryEngine;
  setOutcomeStrategy(strategyType: StrategyType): void;
  getCurrentStrategy(): StrategyType;
  getAvailableStrategies(): StrategyType[];
  getStrategyInfo(strategyType?: StrategyType): {
    name: string;
    description: string;
  };
}

export class DependencyContainer implements IDependencyContainer {
  private outcomeEngine!: IOutcomeEngine;
  private commentaryEngine!: ICommentaryEngine;
  private cricketInputParser!: CricketInputParser;
  private superOverParser!: SuperOverParser;
  private commentaryFormatter!: CommentaryFormatter;
  private superOverFormatter!: SuperOverFormatter;

  private challenge1Service!: IChallenge1Service;
  private challenge2Service!: IChallenge2Service;
  private challenge3Service!: IChallenge3Service;

  private currentStrategyType: StrategyType = 'rule-based';
  private strategies!: Map<StrategyType, IOutcomeStrategy>;

  constructor() {
    this.initializeStrategies();
    this.initializeParsers();
    this.initializeFormatters();
    this.initializeEngines();
    this.initializeServices();
  }

  private initializeStrategies(): void {
    this.strategies = new Map<StrategyType, IOutcomeStrategy>([
      ['rule-based', new RuleBasedOutcomeStrategy()],
      ['probabilistic', new ProbabilisticOutcomeStrategy()],
    ]);
  }

  private initializeParsers(): void {
    this.cricketInputParser = new CricketInputParser();
    this.superOverParser = new SuperOverParser();
  }

  private initializeFormatters(): void {
    this.commentaryFormatter = new CommentaryFormatter();
    this.superOverFormatter = new SuperOverFormatter();
  }

  private initializeEngines(): void {
    const defaultStrategy = this.strategies.get(this.currentStrategyType);
    this.outcomeEngine = new OutcomeEngine(defaultStrategy);
    this.commentaryEngine = new CommentaryEngine();
  }

  private initializeServices(): void {
    this.challenge1Service = new Challenge1Service(
      this.outcomeEngine,
      this.cricketInputParser
    );

    this.challenge2Service = new Challenge2Service(
      this.outcomeEngine,
      this.commentaryEngine,
      this.cricketInputParser,
      this.commentaryFormatter
    );

    this.challenge3Service = new Challenge3Service(
      this.outcomeEngine,
      this.commentaryEngine,
      this.superOverParser,
      this.superOverFormatter
    );
  }

  getChallenge1Service(): IChallenge1Service {
    return this.challenge1Service;
  }

  getChallenge2Service(): IChallenge2Service {
    return this.challenge2Service;
  }

  getChallenge3Service(): IChallenge3Service {
    return this.challenge3Service;
  }

  getOutcomeEngine(): IOutcomeEngine {
    return this.outcomeEngine;
  }

  getCommentaryEngine(): ICommentaryEngine {
    return this.commentaryEngine;
  }

  setOutcomeStrategy(strategyType: StrategyType): void {
    const strategy = this.strategies.get(strategyType);
    if (!strategy) {
      throw new Error(`Unknown strategy type: ${strategyType}`);
    }

    this.currentStrategyType = strategyType;
    this.outcomeEngine.setStrategy(strategy);
  }

  getCurrentStrategy(): StrategyType {
    return this.currentStrategyType;
  }

  getAvailableStrategies(): StrategyType[] {
    return Array.from(this.strategies.keys());
  }

  getStrategyInfo(strategyType?: StrategyType): {
    name: string;
    description: string;
  } {
    const type = strategyType || this.currentStrategyType;
    const strategy = this.strategies.get(type);

    if (!strategy) {
      throw new Error(`Unknown strategy type: ${type}`);
    }

    return {
      name: strategy.getName(),
      description: strategy.getDescription(),
    };
  }

  // Factory methods for creating new instances if needed
  createOutcomeEngine(strategyType: StrategyType): IOutcomeEngine {
    const strategy = this.strategies.get(strategyType);
    if (!strategy) {
      throw new Error(`Unknown strategy type: ${strategyType}`);
    }
    return new OutcomeEngine(strategy);
  }

  createCommentaryEngine(): ICommentaryEngine {
    return new CommentaryEngine();
  }
}
