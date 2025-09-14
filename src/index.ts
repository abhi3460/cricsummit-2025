/**
 * CRICSUMMIT'25 - Main Entry Point
 * Cricket Outcome Prediction & Commentary System
 * 
 * This is the main entry point for the TypeScript implementation
 * that can be run from command line or imported as a module.
 */

import { Challenge1 } from './challenge1';
import { Challenge2 } from './challenge2';
import { Challenge3 } from './challenge3';

/**
 * Main application class that orchestrates both challenges
 */
export class CricSummitApp {
  private challenge1: Challenge1;
  private challenge2: Challenge2;
  private challenge3: Challenge3;

  constructor() {
    this.challenge1 = new Challenge1();
    this.challenge2 = new Challenge2();
    this.challenge3 = new Challenge3();
  }

  /**
   * Run Challenge 1 with provided input
   */
  runChallenge1(input: string): string[] {
    const outcomes = this.challenge1.processStringInput(input);
    return outcomes;
  }

  /**
   * Run Challenge 2 with provided input
   */
  runChallenge2(input: string): string[] {
    const outputs = this.challenge2.processStringInput(input);
    return outputs.map(output => `${output.commentary} - ${output.outcome}`);
  }

  /**
   * Run Challenge 3 with provided input
   */
  runChallenge3(input: string): string[] {
    return this.challenge3.processStringInput(input);
  }

  /**
   * Display sample inputs and outputs
   */
  displaySamples(): void {
    console.log('\n🏏 CRICSUMMIT\'25 - Sample Demonstrations 🏏\n');
    
    // Challenge 1 Sample
    console.log('Challenge #1: Predict Outcome');
    console.log('=============================');
    const sample1Input = this.challenge1.getSampleInput();
    const sample1Output = this.challenge1.getSampleOutput();
    
    console.log('Sample Input:');
    sample1Input.forEach((line, index) => {
      console.log(`${index + 1}. ${line}`);
    });
    
    console.log('\nSample Output:');
    sample1Output.forEach((outcome, index) => {
      console.log(`${index + 1}. ${outcome}`);
    });

    console.log('\n' + '='.repeat(50) + '\n');

    // Challenge 2 Sample
    console.log('Challenge #2: Commentary');
    console.log('========================');
    const sample2Input = this.challenge2.getSampleInput();
    const sample2Output = this.challenge2.getSampleOutput();
    
    console.log('Sample Input:');
    sample2Input.forEach((line, index) => {
      console.log(`${index + 1}. ${line}`);
    });
    
    console.log('\nSample Output:');
    sample2Output.forEach((output, index) => {
      console.log(`${index + 1}. ${output.commentary} - ${output.outcome}`);
    });

    console.log('\n' + '='.repeat(50) + '\n');

    // Challenge 3 Sample
    console.log('Challenge #3: Super Over');
    console.log('========================');
    const sample3Input = this.challenge3.getSampleInput();
    
    console.log('Sample Input:');
    sample3Input.forEach((line, index) => {
      console.log(`${index + 1}. ${line}`);
    });
    
    console.log('\nSample Output (varies based on target):');
    console.log('Sudhakar bowled Bouncer ball,');
    console.log('Craig played Perfect Straight shot');
    console.log('Excellent line and length - 4 runs');
    console.log('... (bowl-by-bowl commentary)');
    console.log('AUSTRALIA scored: 18 runs');
    console.log('AUSTRALIA won by 2 wickets');
  }

  /**
   * Run interactive mode
   */
  runInteractive(): void {
    console.log('\n🏏 CRICSUMMIT\'25 - Interactive Mode 🏏\n');
    console.log('Available commands:');
    console.log('1. challenge1 <input> - Run Challenge 1');
    console.log('2. challenge2 <input> - Run Challenge 2');
    console.log('3. challenge3 <input> - Run Challenge 3 (Super Over)');
    console.log('4. samples - Show sample inputs/outputs');
    console.log('5. help - Show this help');
    console.log('6. exit - Exit the application');
    console.log('\nExamples:');
    console.log('  challenge1 "Bouncer Pull Perfect\\nYorker Straight Early"');
    console.log('  challenge3 "Straight Perfect\\nFlick Early\\nHook Good\\nLegLance Good\\nLongOff Late\\nLongOn Perfect"\n');
  }
}

/**
 * Command line interface
 */
function main(): void {
  const app = new CricSummitApp();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    app.displaySamples();
    app.runInteractive();
    return;
  }

  const command = args[0];

  switch (command) {
    case 'challenge1':
      if (args.length < 2) {
        console.error('Error: Please provide input for Challenge 1');
        console.log('Example: npm run dev challenge1 "Bouncer Pull Perfect"');
        process.exit(1);
      }
      const input1 = args.slice(1).join(' ').replace(/\\n/g, '\n');
      const results1 = app.runChallenge1(input1);
      console.log('Challenge 1 Results:');
      results1.forEach((result, index) => {
        console.log(`${index + 1}. ${result}`);
      });
      break;

    case 'challenge2':
      if (args.length < 2) {
        console.error('Error: Please provide input for Challenge 2');
        console.log('Example: npm run dev challenge2 "Bouncer Pull Late"');
        process.exit(1);
      }
      const input2 = args.slice(1).join(' ').replace(/\\n/g, '\n');
      const results2 = app.runChallenge2(input2);
      console.log('Challenge 2 Results:');
      results2.forEach((result, index) => {
        console.log(`${index + 1}. ${result}`);
      });
      break;

    case 'challenge3':
      if (args.length < 2) {
        console.error('Error: Please provide input for Challenge 3');
        console.log('Example: npm run dev challenge3 "Straight Perfect\\nFlick Early\\nHook Good\\nLegLance Good\\nLongOff Late\\nLongOn Perfect"');
        process.exit(1);
      }
      const input3 = args.slice(1).join(' ').replace(/\\n/g, '\n');
      const results3 = app.runChallenge3(input3);
      console.log('Challenge 3 Results:');
      results3.forEach((result, index) => {
        console.log(`${result}`);
      });
      break;

    case 'samples':
      app.displaySamples();
      break;

    case 'help':
      app.runInteractive();
      break;

    default:
      console.error(`Unknown command: ${command}`);
      app.runInteractive();
      process.exit(1);
  }
}

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}

// Export for use as a module
export { Challenge1 } from './challenge1';
export { Challenge2 as CommentaryChallenge } from './challenge2';
export { Challenge3 } from './challenge3';
export { OutcomeEngine } from './outcome-engine';
export { CommentaryEngine } from './commentary-engine';
export * from './types';
