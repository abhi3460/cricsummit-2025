/**
 * CRICSUMMIT'25 - Browser Application
 * Cricket Outcome Prediction & Commentary System
 *
 * This is a simplified browser version of the TypeScript implementation
 * for visual demonstration purposes.
 */

// Cricket outcome prediction engine
class OutcomeEngine {
  constructor() {
    this.outcomeMap = new Map();
    this.unrealisticCombinations = {
      'Bouncer|Sweep': {
        reason: 'You cannot sweep a bouncer - the ball is too high!',
        funMessage:
          "🏏 'Sweeping a bouncer? That's like trying to sweep the ceiling! The ball is way up there, mate!'",
        alternativeSuggestion: 'Try Pull or UpperCut instead',
      },
      'Yorker|Sweep': {
        reason: 'Sweeping a yorker is extremely difficult and risky',
        funMessage:
          "🏏 'Sweeping a yorker? Good luck with that! You might as well try to sweep the floor while the ball is at your toes!'",
        alternativeSuggestion: 'Try Straight or Flick instead',
      },
      'Doosra|Scoop': {
        reason: 'Scooping a doosra is extremely risky and rarely attempted',
        funMessage:
          "🏏 'Scooping a doosra? That's like trying to scoop ice cream with a spoon that keeps changing direction!'",
        alternativeSuggestion: 'Try Flick or LegGlance instead',
      },
      'Bouncer|LegGlance': {
        reason: 'Leg glancing a bouncer is very difficult due to the height',
        funMessage:
          "🏏 'Leg glancing a bouncer? The ball is at your head level, not your legs! Physics called, they want their laws back!'",
        alternativeSuggestion: 'Try Pull or UpperCut instead',
      },
      'Yorker|UpperCut': {
        reason: 'Upper cutting a yorker is nearly impossible',
        funMessage:
          "🏏 'Upper cutting a yorker? That's like trying to uppercut someone who's already on the ground!'",
        alternativeSuggestion: 'Try Straight or Flick instead',
      },
      'Pace|Scoop': {
        reason: 'Scooping a fast pace ball is extremely risky',
        funMessage:
          "🏏 'Scooping a pace ball? That's like trying to scoop a bullet! Good luck with that timing!'",
        alternativeSuggestion: 'Try Straight or CoverDrive instead',
      },
      'Leg Cutter|Scoop': {
        reason: 'Scooping a leg cutter is very difficult',
        funMessage:
          "🏏 'Scooping a leg cutter? That's like trying to scoop soup with a knife! The ball is cutting away from you!'",
        alternativeSuggestion: 'Try Flick or LegGlance instead',
      },
      'Slower Ball|UpperCut': {
        reason: 'Upper cutting a slower ball is counterproductive',
        funMessage:
          "🏏 'Upper cutting a slower ball? That's like trying to uppercut a feather! The ball is already slow, why make it slower?'",
        alternativeSuggestion: 'Try Straight or SquareCut instead',
      },
    };
    this.initializeOutcomeRules();
  }

  initializeOutcomeRules() {
    const rules = [
      // Bouncer ball combinations
      {
        bowling: 'Bouncer',
        shot: 'Pull',
        timing: {
          Early: '2 runs',
          Good: '4 runs',
          Perfect: '6 runs',
          Late: '1 wicket',
        },
      },
      {
        bowling: 'Bouncer',
        shot: 'UpperCut',
        timing: {
          Early: '1 run',
          Good: '4 runs',
          Perfect: '6 runs',
          Late: '1 wicket',
        },
      },
      {
        bowling: 'Bouncer',
        shot: 'Straight',
        timing: {
          Early: '1 wicket',
          Good: '2 runs',
          Perfect: '4 runs',
          Late: '1 wicket',
        },
      },

      // Yorker combinations
      {
        bowling: 'Yorker',
        shot: 'Straight',
        timing: {
          Early: '1 wicket',
          Good: '2 runs',
          Perfect: '4 runs',
          Late: '1 wicket',
        },
      },

      // Pace ball combinations
      {
        bowling: 'Pace',
        shot: 'Straight',
        timing: {
          Early: '1 run',
          Good: '3 runs',
          Perfect: '4 runs',
          Late: '2 runs',
        },
      },

      // Off Break combinations
      {
        bowling: 'Off Break',
        shot: 'Sweep',
        timing: {
          Early: '1 wicket',
          Good: '2 runs',
          Perfect: '4 runs',
          Late: '1 wicket',
        },
      },

      // Inswinger combinations
      {
        bowling: 'Inswinger',
        shot: 'Flick',
        timing: {
          Early: '1 run',
          Good: '3 runs',
          Perfect: '4 runs',
          Late: '2 runs',
        },
      },

      // Outswinger combinations
      {
        bowling: 'Outswinger',
        shot: 'CoverDrive',
        timing: {
          Early: '1 run',
          Good: '2 runs',
          Perfect: '4 runs',
          Late: '1 wicket',
        },
      },
      {
        bowling: 'Outswinger',
        shot: 'Pull',
        timing: {
          Early: '1 wicket',
          Good: '2 runs',
          Perfect: '4 runs',
          Late: '1 wicket',
        },
      },
      {
        bowling: 'Outswinger',
        shot: 'Sweep',
        timing: {
          Early: '1 wicket',
          Good: '2 runs',
          Perfect: '4 runs',
          Late: '1 wicket',
        },
      },

      // Slower Ball combinations
      {
        bowling: 'Slower Ball',
        shot: 'SquareCut',
        timing: {
          Early: '1 wicket',
          Good: '3 runs',
          Perfect: '4 runs',
          Late: '2 runs',
        },
      },
      {
        bowling: 'Slower Ball',
        shot: 'CoverDrive',
        timing: {
          Early: '1 run',
          Good: '2 runs',
          Perfect: '4 runs',
          Late: '1 wicket',
        },
      },
      {
        bowling: 'Slower Ball',
        shot: 'Long On',
        timing: {
          Early: '1 run',
          Good: '2 runs',
          Perfect: '4 runs',
          Late: '1 wicket',
        },
      },

      // Leg Cutter combinations
      {
        bowling: 'Leg Cutter',
        shot: 'LegGlance',
        timing: {
          Early: '1 run',
          Good: '2 runs',
          Perfect: '3 runs',
          Late: '1 wicket',
        },
      },

      // Doosra combinations
      {
        bowling: 'Doosra',
        shot: 'Scoop',
        timing: {
          Early: '1 wicket',
          Good: '4 runs',
          Perfect: '6 runs',
          Late: '1 wicket',
        },
      },

      // Off Break + UpperCut combination (made realistic)
      {
        bowling: 'Off Break',
        shot: 'UpperCut',
        timing: {
          Early: '1 wicket',
          Good: '2 runs',
          Perfect: '4 runs',
          Late: '1 wicket',
        },
      },

      // Off Cutter combinations
      {
        bowling: 'Off Cutter',
        shot: 'SquareCut',
        timing: {
          Early: '1 wicket',
          Good: '3 runs',
          Perfect: '4 runs',
          Late: '2 runs',
        },
      },
      {
        bowling: 'Off Cutter',
        shot: 'CoverDrive',
        timing: {
          Early: '1 run',
          Good: '2 runs',
          Perfect: '4 runs',
          Late: '1 wicket',
        },
      },
      {
        bowling: 'Off Cutter',
        shot: 'Long On',
        timing: {
          Early: '1 run',
          Good: '2 runs',
          Perfect: '4 runs',
          Late: '1 wicket',
        },
      },
      {
        bowling: 'Slower Ball',
        shot: 'Long On',
        timing: {
          Early: '1 run',
          Good: '2 runs',
          Perfect: '4 runs',
          Late: '1 wicket',
        },
      },
    ];

    rules.forEach(rule => {
      Object.entries(rule.timing).forEach(([timing, outcome]) => {
        const key = `${rule.bowling}|${rule.shot}|${timing}`;
        this.outcomeMap.set(key, outcome);
      });
    });
  }

  checkUnrealisticCombination(bowlingType, shotType) {
    const key = `${bowlingType}|${shotType}`;
    return this.unrealisticCombinations[key];
  }

  predictOutcome(bowlingType, shotType, timing) {
    // Check for unrealistic combinations first
    const unrealisticCombo = this.checkUnrealisticCombination(
      bowlingType,
      shotType
    );
    if (unrealisticCombo) {
      throw new Error(unrealisticCombo.funMessage);
    }

    const key = `${bowlingType}|${shotType}|${timing}`;
    return this.outcomeMap.get(key) || '2 runs';
  }
}

// Commentary engine
class CommentaryEngine {
  constructor() {
    this.commentaryMap = new Map([
      ['1 wicket', "It's a wicket."],
      ['1 run', 'Convert ones into twos.'],
      ['2 runs', 'Excellent running between the wickets.'],
      ['3 runs', 'Just over the fielder.'],
      ['4 runs', 'Excellent line and length.'],
      ['5 runs', 'Excellent effort on the boundary.'],
      ['6 runs', "That's massive and out of the ground."],
    ]);
  }

  getCommentary(outcome) {
    return this.commentaryMap.get(outcome) || 'Excellent line and length.';
  }
}

// Global instances
const outcomeEngine = new OutcomeEngine();
const commentaryEngine = new CommentaryEngine();

// Voice commentary setup
let speechSynthesis = window.speechSynthesis;
let isVoiceEnabled = false;
let currentVoice = null;

// Initialize voice settings
function initializeVoice() {
  if ('speechSynthesis' in window) {
    // Wait for voices to load
    speechSynthesis.onvoiceschanged = function () {
      const voices = speechSynthesis.getVoices();
      // Try to find a good English voice
      currentVoice =
        voices.find(
          voice =>
            voice.lang.startsWith('en') &&
            (voice.name.includes('Google') ||
              voice.name.includes('Microsoft') ||
              voice.name.includes('Samantha'))
        ) ||
        voices.find(voice => voice.lang.startsWith('en')) ||
        voices[0];
    };

    // Load voices immediately if already available
    if (speechSynthesis.getVoices().length > 0) {
      speechSynthesis.onvoiceschanged();
    }
  }
}

// Speak commentary
function speakCommentary(text) {
  if (!isVoiceEnabled || !speechSynthesis) return;

  // Cancel any ongoing speech
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = currentVoice;
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1.0;
  utterance.volume = 0.8;

  speechSynthesis.speak(utterance);
}

// Toggle voice on/off
function toggleVoice() {
  isVoiceEnabled = !isVoiceEnabled;
  const button = document.getElementById('voiceToggle');

  if (isVoiceEnabled) {
    button.textContent = '🔊 Voice ON';
    button.style.background = 'linear-gradient(45deg, #00ff00, #00aa00)';
    speakCommentary('Voice commentary enabled!');
  } else {
    button.textContent = '🔇 Voice OFF';
    button.style.background = 'linear-gradient(45deg, #666, #333)';
    speechSynthesis.cancel();
  }
}

// Console utilities
function addToConsole(consoleId, message, type = 'output') {
  const console = document.getElementById(consoleId);
  const line = document.createElement('div');
  line.className = `console-line ${type}-line`;

  if (type === 'input') {
    line.innerHTML = `<span class="blink">$</span> ${message}`;
  } else if (type === 'commentary') {
    line.innerHTML = `<span class="commentary">💬 ${message}</span>`;
  } else if (type === 'error') {
    line.innerHTML = `<span class="error">❌ ${message}</span>`;
  } else {
    line.innerHTML = `▶️ ${message}`;
  }

  console.appendChild(line);
  console.scrollTop = console.scrollHeight;
}

function clearConsole(consoleId) {
  document.getElementById(consoleId).innerHTML = '';
}

// Challenge 1 functions
function runChallenge1() {
  const input = document.getElementById('input1').value.trim();
  if (!input) {
    addToConsole('console1', 'Please enter input first!', 'error');
    return;
  }

  clearConsole('console1');
  addToConsole('console1', 'Running Challenge 1: Predict Outcome', 'input');
  addToConsole('console1', 'Input:', 'input');

  const lines = input.split('\n');
  lines.forEach(line => {
    if (line.trim()) {
      addToConsole('console1', line, 'input');
    }
  });

  addToConsole('console1', 'Output:', 'input');

  lines.forEach(line => {
    if (line.trim()) {
      const parts = line.trim().split(' ');
      if (parts.length === 3) {
        const [bowling, shot, timing] = parts;
        try {
          const outcome = outcomeEngine.predictOutcome(bowling, shot, timing);
          addToConsole('console1', outcome, 'output');
        } catch (error) {
          addToConsole('console1', error.message, 'error');
        }
      }
    }
  });
}

function loadSample1() {
  const sampleInput = `Bouncer Pull Perfect
Yorker Straight Early
Pace Straight Good`;
  document.getElementById('input1').value = sampleInput;
  addToConsole('console1', 'Sample input loaded!', 'input');
}

function clearConsole1() {
  clearConsole('console1');
}

// Challenge 2 functions
function runChallenge2() {
  const input = document.getElementById('input2').value.trim();
  if (!input) {
    addToConsole('console2', 'Please enter input first!', 'error');
    return;
  }

  clearConsole('console2');
  addToConsole('console2', 'Running Challenge 2: Commentary', 'input');
  addToConsole('console2', 'Input:', 'input');

  const lines = input.split('\n');
  lines.forEach(line => {
    if (line.trim()) {
      addToConsole('console2', line, 'input');
    }
  });

  addToConsole('console2', 'Output:', 'input');

  lines.forEach(line => {
    if (line.trim()) {
      const parts = line.trim().split(' ');
      if (parts.length === 3) {
        const [bowling, shot, timing] = parts;
        try {
          const outcome = outcomeEngine.predictOutcome(bowling, shot, timing);
          const commentary = commentaryEngine.getCommentary(outcome);
          addToConsole('console2', commentary, 'commentary');
          addToConsole('console2', `${commentary} - ${outcome}`, 'output');

          // Speak commentary if voice is enabled
          speakCommentary(commentary);
        } catch (error) {
          addToConsole('console2', error.message, 'error');
        }
      }
    }
  });
}

// Challenge 3 functions
function runChallenge3() {
  const input = document.getElementById('input3').value.trim();
  if (!input) {
    addToConsole('console3', 'Please enter input first!', 'error');
    return;
  }

  const lines = input.split('\n').filter(line => line.trim());
  if (lines.length !== 6) {
    addToConsole(
      'console3',
      'Super Over requires exactly 6 shot inputs!',
      'error'
    );
    return;
  }

  clearConsole('console3');
  addToConsole('console3', 'Running Challenge 3: Super Over', 'input');
  addToConsole('console3', 'Input:', 'input');

  lines.forEach(line => {
    addToConsole('console3', line, 'input');
  });

  addToConsole('console3', 'Output:', 'input');

  // Simulate Super Over
  const bowlingCards = [
    'Bouncer',
    'Inswinger',
    'Outswinger',
    'Leg Cutter',
    'Off Cutter',
    'Slower Ball',
  ];
  const targetRuns = Math.floor(Math.random() * 13) + 8; // 8-20 runs
  let scoredRuns = 0;
  let wicketsLost = 0;
  let ballsPlayed = 0;

  for (let i = 0; i < 6 && wicketsLost < 2; i++) {
    const parts = lines[i].trim().split(' ');
    if (parts.length === 2) {
      const [shotType, timing] = parts;
      const bowlingType = bowlingCards[i];

      try {
        const outcome = outcomeEngine.predictOutcome(
          bowlingType,
          shotType,
          timing
        );
        const commentary = commentaryEngine.getCommentary(outcome);

        addToConsole(
          'console3',
          `Sudhakar bowled ${bowlingType} ball,`,
          'output'
        );
        addToConsole(
          'console3',
          `Craig played ${timing} ${shotType} shot`,
          'output'
        );
        addToConsole('console3', `${commentary} - ${outcome}`, 'commentary');
        addToConsole('console3', '', 'output');

        ballsPlayed++;

        // Extract runs and wickets
        if (outcome === '1 wicket') {
          wicketsLost++;
        } else {
          const runsMatch = outcome.match(/(\d+)\s+runs?/);
          if (runsMatch) {
            scoredRuns += parseInt(runsMatch[1]);
          }
        }

        // Check if target is achieved
        if (scoredRuns >= targetRuns && wicketsLost < 2) {
          break;
        }

        // Speak commentary if voice is enabled
        speakCommentary(commentary);
      } catch (error) {
        addToConsole('console3', error.message, 'error');
        break; // Stop the Super Over if there's an unrealistic combination
      }
    }
  }

  // Match summary
  const matchResult =
    scoredRuns >= targetRuns && wicketsLost < 2 ? 'won' : 'lost';
  let margin;
  if (matchResult === 'won') {
    if (wicketsLost === 0) {
      margin = `${ballsPlayed} balls`;
    } else {
      margin = `${2 - wicketsLost} wickets`;
    }
  } else {
    margin = `${targetRuns - scoredRuns} runs`;
  }

  addToConsole('console3', `AUSTRALIA scored: ${scoredRuns} runs`, 'output');
  addToConsole('console3', `AUSTRALIA ${matchResult} by ${margin}`, 'output');
}

function loadSample2() {
  const sampleInput = `Bouncer Pull Late`;
  document.getElementById('input2').value = sampleInput;
  addToConsole('console2', 'Sample input loaded!', 'input');
}

function clearConsole2() {
  clearConsole('console2');
}

function loadSample3() {
  const sampleInput = `Straight Perfect
Flick Early
Hook Good
LegLance Good
LongOff Late
LongOn Perfect`;
  document.getElementById('input3').value = sampleInput;
  addToConsole('console3', 'Sample input loaded!', 'input');
}

function clearConsole3() {
  clearConsole('console3');
}

// Unrealistic sample functions
function loadUnrealisticSample1() {
  const sampleInput = `Bouncer Sweep Perfect
Yorker UpperCut Good
Pace Scoop Early`;
  document.getElementById('input1').value = sampleInput;
  addToConsole('console1', 'Sample input loaded!', 'input');
}

function loadUnrealisticSample2() {
  const sampleInput = `Bouncer Sweep Perfect
Yorker UpperCut Good
Pace Scoop Early`;
  document.getElementById('input2').value = sampleInput;
  addToConsole('console2', 'Sample input loaded!', 'input');
}

function loadUnrealisticSample3() {
  const sampleInput = `Sweep Perfect
UpperCut Early
Scoop Good
Scoop Perfect
Sweep Good
UpperCut Perfect`;
  document.getElementById('input3').value = sampleInput;
  addToConsole('console3', 'Sample input loaded!', 'input');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
  addToConsole('console1', "CRICSUMMIT'25 Challenge #1 Ready!", 'input');
  addToConsole('console2', "CRICSUMMIT'25 Challenge #2 Ready!", 'input');
  addToConsole('console3', "CRICSUMMIT'25 Challenge #3 Ready!", 'input');

  // Initialize voice
  initializeVoice();

  // Add some initial instructions
  addToConsole(
    'console1',
    'Use Load Sample button to see example input',
    'input'
  );
  addToConsole(
    'console2',
    'Use Load Sample button to see example input',
    'input'
  );
  addToConsole(
    'console3',
    'Use Load Sample button to see example input',
    'input'
  );
});

// Quick Options Functions

function fillBowling(bowling) {
  fillInput(bowling);
}

function fillShot(shot) {
  fillInput(shot);
}

function fillTiming(timing) {
  fillInput(timing);
}

function fillInput(value) {
  const activeElement = document.activeElement;
  let targetInput = document.getElementById('input1'); // Default to Challenge 1

  if (
    activeElement &&
    activeElement.tagName === 'TEXTAREA' &&
    activeElement.id.startsWith('input')
  ) {
    targetInput = activeElement;
  }

  const currentValue = targetInput.value.trim();
  if (currentValue === '') {
    targetInput.value = value;
  } else {
    targetInput.value += '\n' + value;
  }
  targetInput.focus();
}

function getActiveInput() {
  const inputs = ['input1', 'input2', 'input3'];
  for (const inputId of inputs) {
    const input = document.getElementById(inputId);
    if (input === document.activeElement) {
      return input;
    }
  }
  // If no input is focused, return the first one
  return document.getElementById('input1');
}
