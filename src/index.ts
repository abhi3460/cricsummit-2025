/**
 * Entry Point for CRICSUMMIT'25
 * Cricket Outcome Prediction and Commentary System
 */

import { CricketApp } from './app/cricket-app';

function main(): void {
  const args = process.argv.slice(2);
  const app = new CricketApp();

  if (args.length === 0) {
    runInteractiveMode(app);
    return;
  }

  const [command, ...inputArgs] = args;
  const input = inputArgs.join(' ').replace(/\\n/g, '\n');

  switch (command.toLowerCase()) {
    case 'challenge1':
      runChallenge1(app, input);
      break;
    case 'challenge2':
      runChallenge2(app, input);
      break;
    case 'challenge3':
      runChallenge3(app, input);
      break;
    case 'samples':
      app.displaySamples();
      break;
    case 'strategy':
      handleStrategyCommand(app, inputArgs);
      break;
    default:
      displayUsage();
  }
}

function runChallenge1(app: CricketApp, input: string): void {
  console.log('🏏 Running Challenge 1: Predict Outcome');
  console.log('=======================================\n');

  if (!input) {
    console.log('Using sample input...\n');
    // Use sample input from the service
    input = 'Bouncer Pull Perfect\nYorker Straight Early\nPace Straight Good';
  }

  console.log('Input:');
  input.split('\n').forEach(line => line.trim() && console.log(`  ${line}`));

  console.log('\nOutput:');
  const results = app.runChallenge1(input);
  results.forEach(result => console.log(`  ${result}`));
}

function runChallenge2(app: CricketApp, input: string): void {
  console.log('🎙️  Running Challenge 2: Commentary');
  console.log('===================================\n');

  if (!input) {
    console.log('Using sample input...\n');
    input = 'Bouncer Pull Late';
  }

  console.log('Input:');
  input.split('\n').forEach(line => line.trim() && console.log(`  ${line}`));

  console.log('\nOutput:');
  const results = app.runChallenge2(input);
  results.forEach(result => console.log(`  ${result}`));
}

function runChallenge3(app: CricketApp, input: string): void {
  console.log('🏆 Running Challenge 3: Super Over');
  console.log('=================================\n');

  if (!input) {
    console.log('Using sample input...\n');
    input =
      'Straight Perfect\nFlick Early\nSweep Good\nLegGlance Good\nSquareCut Late\nCoverDrive Perfect';
  }

  console.log('Input:');
  input.split('\n').forEach(line => line.trim() && console.log(`  ${line}`));

  console.log('\nOutput:');
  const results = app.runChallenge3(input);
  results.forEach(result => console.log(result));
}

function handleStrategyCommand(app: CricketApp, args: string[]): void {
  if (args.length === 0) {
    console.log('🧠 Current Strategy Information');
    console.log('==============================\n');

    const currentStrategy = app.getCurrentStrategy();
    const info = app.getStrategyInfo();

    console.log(`Current Strategy: ${info.name}`);
    console.log(`Description: ${info.description}\n`);

    console.log('Available Strategies:');
    app.getAvailableStrategies().forEach(strategy => {
      const strategyInfo = app.getStrategyInfo(strategy);
      const current = strategy === currentStrategy ? ' (CURRENT)' : '';
      console.log(`  📈 ${strategy}${current}: ${strategyInfo.name}`);
    });
    return;
  }

  const [strategyType] = args;

  try {
    app.setOutcomeStrategy(strategyType as any);
    console.log(`✅ Strategy changed to: ${strategyType}`);

    const info = app.getStrategyInfo();
    console.log(`Description: ${info.description}`);
  } catch (error) {
    console.error(
      `❌ Failed to set strategy: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    console.log('\nAvailable strategies:');
    app.getAvailableStrategies().forEach(strategy => {
      console.log(`  - ${strategy}`);
    });
  }
}

function runInteractiveMode(app: CricketApp): void {
  console.log("🏏 CRICSUMMIT'25 - Interactive Mode");
  console.log('===================================\n');

  app.displaySamples();

  console.log('💡 Usage Examples:');
  console.log('------------------');
  console.log('npm run dev challenge1 "Bouncer Pull Perfect"');
  console.log('npm run dev challenge2 "Bouncer Pull Late"');
  console.log(
    'npm run dev challenge3 "Straight Perfect\\nFlick Early\\nSweep Good\\nLegGlance Good\\nSquareCut Late\\nCoverDrive Perfect"'
  );
  console.log('npm run dev strategy rule-based');
  console.log('npm run dev samples');
  console.log();
}

function displayUsage(): void {
  console.log("🏏 CRICSUMMIT'25 - Usage");
  console.log('========================\n');

  console.log('Commands:');
  console.log('  challenge1 <input>  - Run Challenge 1: Predict Outcome');
  console.log('  challenge2 <input>  - Run Challenge 2: Commentary');
  console.log('  challenge3 <input>  - Run Challenge 3: Super Over');
  console.log(
    '  strategy [type]     - View or change outcome prediction strategy'
  );
  console.log('  samples             - Show sample inputs and outputs');
  console.log();

  console.log('Examples:');
  console.log('  npm run dev challenge1 "Bouncer Pull Perfect"');
  console.log('  npm run dev challenge2 "Bouncer Pull Late"');
  console.log('  npm run dev strategy probabilistic');
  console.log('  npm run dev samples');
  console.log();
}

// Start the application
if (require.main === module) {
  main();
}

export { main };
