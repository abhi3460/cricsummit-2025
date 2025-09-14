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
    this.initializeOutcomeRules();
  }

  initializeOutcomeRules() {
    const rules = [
      // Bouncer ball combinations
      {
        bowling: "Bouncer",
        shot: "Pull",
        timing: {
          Early: "2 runs",
          Good: "4 runs",
          Perfect: "6 runs",
          Late: "1 wicket",
        },
      },
      {
        bowling: "Bouncer",
        shot: "UpperCut",
        timing: {
          Early: "1 run",
          Good: "4 runs",
          Perfect: "6 runs",
          Late: "1 wicket",
        },
      },

      // Yorker combinations
      {
        bowling: "Yorker",
        shot: "Straight",
        timing: {
          Early: "1 wicket",
          Good: "2 runs",
          Perfect: "4 runs",
          Late: "1 wicket",
        },
      },

      // Pace ball combinations
      {
        bowling: "Pace",
        shot: "Straight",
        timing: {
          Early: "1 run",
          Good: "3 runs",
          Perfect: "4 runs",
          Late: "2 runs",
        },
      },

      // Off Break combinations
      {
        bowling: "Off Break",
        shot: "Sweep",
        timing: {
          Early: "1 wicket",
          Good: "2 runs",
          Perfect: "4 runs",
          Late: "1 wicket",
        },
      },

      // Inswinger combinations
      {
        bowling: "Inswinger",
        shot: "Flick",
        timing: {
          Early: "1 run",
          Good: "3 runs",
          Perfect: "4 runs",
          Late: "2 runs",
        },
      },

      // Outswinger combinations
      {
        bowling: "Outswinger",
        shot: "CoverDrive",
        timing: {
          Early: "1 run",
          Good: "2 runs",
          Perfect: "4 runs",
          Late: "1 wicket",
        },
      },

      // Slower Ball combinations
      {
        bowling: "Slower Ball",
        shot: "SquareCut",
        timing: {
          Early: "1 wicket",
          Good: "3 runs",
          Perfect: "4 runs",
          Late: "2 runs",
        },
      },

      // Leg Cutter combinations
      {
        bowling: "Leg Cutter",
        shot: "LegLance",
        timing: {
          Early: "1 run",
          Good: "2 runs",
          Perfect: "3 runs",
          Late: "1 wicket",
        },
      },

      // Doosra combinations
      {
        bowling: "Doosra",
        shot: "Scoop",
        timing: {
          Early: "1 wicket",
          Good: "4 runs",
          Perfect: "6 runs",
          Late: "1 wicket",
        },
      },
    ];

    rules.forEach((rule) => {
      Object.entries(rule.timing).forEach(([timing, outcome]) => {
        const key = `${rule.bowling}|${rule.shot}|${timing}`;
        this.outcomeMap.set(key, outcome);
      });
    });
  }

  predictOutcome(bowlingType, shotType, timing) {
    const key = `${bowlingType}|${shotType}|${timing}`;
    return this.outcomeMap.get(key) || "2 runs";
  }
}

// Commentary engine
class CommentaryEngine {
  constructor() {
    this.commentaryMap = new Map([
      ["1 wicket", "It's a wicket."],
      ["1 run", "Convert ones into twos."],
      ["2 runs", "Excellent running between the wickets."],
      ["3 runs", "Just over the fielder."],
      ["4 runs", "Excellent line and length."],
      ["5 runs", "Excellent effort on the boundary."],
      ["6 runs", "That's massive and out of the ground."],
    ]);
  }

  getCommentary(outcome) {
    return this.commentaryMap.get(outcome) || "Excellent line and length.";
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
  if ("speechSynthesis" in window) {
    // Wait for voices to load
    speechSynthesis.onvoiceschanged = function () {
      const voices = speechSynthesis.getVoices();
      // Try to find a good English voice
      currentVoice =
        voices.find(
          (voice) =>
            voice.lang.startsWith("en") &&
            (voice.name.includes("Google") ||
              voice.name.includes("Microsoft") ||
              voice.name.includes("Samantha"))
        ) ||
        voices.find((voice) => voice.lang.startsWith("en")) ||
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
  const button = document.getElementById("voiceToggle");

  if (isVoiceEnabled) {
    button.textContent = "🔊 Voice ON";
    button.style.background = "linear-gradient(45deg, #00ff00, #00aa00)";
    speakCommentary("Voice commentary enabled!");
  } else {
    button.textContent = "🔇 Voice OFF";
    button.style.background = "linear-gradient(45deg, #666, #333)";
    speechSynthesis.cancel();
  }
}

// Console utilities
function addToConsole(consoleId, message, type = "output") {
  const console = document.getElementById(consoleId);
  const line = document.createElement("div");
  line.className = `console-line ${type}-line`;

  if (type === "input") {
    line.innerHTML = `<span class="blink">$</span> ${message}`;
  } else if (type === "commentary") {
    line.innerHTML = `<span class="commentary">💬 ${message}</span>`;
  } else if (type === "error") {
    line.innerHTML = `<span class="error">❌ ${message}</span>`;
  } else {
    line.innerHTML = `▶️ ${message}`;
  }

  console.appendChild(line);
  console.scrollTop = console.scrollHeight;
}

function clearConsole(consoleId) {
  document.getElementById(consoleId).innerHTML = "";
}

// Challenge 1 functions
function runChallenge1() {
  const input = document.getElementById("input1").value.trim();
  if (!input) {
    addToConsole("console1", "Please enter input first!", "error");
    return;
  }

  clearConsole("console1");
  addToConsole("console1", "Running Challenge 1: Predict Outcome", "input");
  addToConsole("console1", "Input:", "input");

  const lines = input.split("\n");
  lines.forEach((line) => {
    if (line.trim()) {
      addToConsole("console1", line, "input");
    }
  });

  addToConsole("console1", "Output:", "input");

  lines.forEach((line) => {
    if (line.trim()) {
      const parts = line.trim().split(" ");
      if (parts.length === 3) {
        const [bowling, shot, timing] = parts;
        const outcome = outcomeEngine.predictOutcome(bowling, shot, timing);
        addToConsole("console1", outcome, "output");
      }
    }
  });
}

function loadSample1() {
  const sampleInput = `Bouncer Pull Perfect
Yorker Straight Early
Pace Straight Good`;
  document.getElementById("input1").value = sampleInput;
  addToConsole("console1", "Sample input loaded!", "input");
}

function clearConsole1() {
  clearConsole("console1");
}

// Challenge 2 functions
function runChallenge2() {
  const input = document.getElementById("input2").value.trim();
  if (!input) {
    addToConsole("console2", "Please enter input first!", "error");
    return;
  }

  clearConsole("console2");
  addToConsole("console2", "Running Challenge 2: Commentary", "input");
  addToConsole("console2", "Input:", "input");

  const lines = input.split("\n");
  lines.forEach((line) => {
    if (line.trim()) {
      addToConsole("console2", line, "input");
    }
  });

  addToConsole("console2", "Output:", "input");

  lines.forEach((line) => {
    if (line.trim()) {
      const parts = line.trim().split(" ");
      if (parts.length === 3) {
        const [bowling, shot, timing] = parts;
        const outcome = outcomeEngine.predictOutcome(bowling, shot, timing);
        const commentary = commentaryEngine.getCommentary(outcome);
        addToConsole("console2", commentary, "commentary");
        addToConsole("console2", `${commentary} - ${outcome}`, "output");

        // Speak commentary if voice is enabled
        speakCommentary(commentary);
      }
    }
  });
}

// Challenge 3 functions
function runChallenge3() {
  const input = document.getElementById("input3").value.trim();
  if (!input) {
    addToConsole("console3", "Please enter input first!", "error");
    return;
  }

  const lines = input.split("\n").filter((line) => line.trim());
  if (lines.length !== 6) {
    addToConsole(
      "console3",
      "Super Over requires exactly 6 shot inputs!",
      "error"
    );
    return;
  }

  clearConsole("console3");
  addToConsole("console3", "Running Challenge 3: Super Over", "input");
  addToConsole("console3", "Input:", "input");

  lines.forEach((line) => {
    addToConsole("console3", line, "input");
  });

  addToConsole("console3", "Output:", "input");

  // Simulate Super Over
  const bowlingCards = [
    "Bouncer",
    "Inswinger",
    "Outswinger",
    "Leg Cutter",
    "Off Cutter",
    "Reverse Swing",
  ];
  const targetRuns = Math.floor(Math.random() * 13) + 8; // 8-20 runs
  let scoredRuns = 0;
  let wicketsLost = 0;
  let ballsPlayed = 0;

  for (let i = 0; i < 6 && wicketsLost < 2; i++) {
    const parts = lines[i].trim().split(" ");
    if (parts.length === 2) {
      const [shotType, timing] = parts;
      const bowlingType = bowlingCards[i];

      const outcome = outcomeEngine.predictOutcome(
        bowlingType,
        shotType,
        timing
      );
      const commentary = commentaryEngine.getCommentary(outcome);

      addToConsole(
        "console3",
        `Sudhakar bowled ${bowlingType} ball,`,
        "output"
      );
      addToConsole(
        "console3",
        `Craig played ${timing} ${shotType} shot`,
        "output"
      );
      addToConsole("console3", `${commentary} - ${outcome}`, "commentary");
      addToConsole("console3", "", "output");

      ballsPlayed++;

      // Extract runs and wickets
      if (outcome === "1 wicket") {
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
    }
  }

  // Match summary
  const matchResult =
    scoredRuns >= targetRuns && wicketsLost < 2 ? "won" : "lost";
  let margin;
  if (matchResult === "won") {
    if (wicketsLost === 0) {
      margin = `${ballsPlayed} balls`;
    } else {
      margin = `${2 - wicketsLost} wickets`;
    }
  } else {
    margin = `${targetRuns - scoredRuns} runs`;
  }

  addToConsole("console3", `AUSTRALIA scored: ${scoredRuns} runs`, "output");
  addToConsole("console3", `AUSTRALIA ${matchResult} by ${margin}`, "output");
}

function loadSample2() {
  const sampleInput = `Bouncer Pull Late`;
  document.getElementById("input2").value = sampleInput;
  addToConsole("console2", "Sample input loaded!", "input");
}

function clearConsole2() {
  clearConsole("console2");
}

function loadSample3() {
  const sampleInput = `Straight Perfect
Flick Early
Hook Good
LegLance Good
LongOff Late
LongOn Perfect`;
  document.getElementById("input3").value = sampleInput;
  addToConsole("console3", "Sample input loaded!", "input");
}

function clearConsole3() {
  clearConsole("console3");
}

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  addToConsole("console1", "CRICSUMMIT'25 Challenge #1 Ready!", "input");
  addToConsole("console2", "CRICSUMMIT'25 Challenge #2 Ready!", "input");
  addToConsole("console3", "CRICSUMMIT'25 Challenge #3 Ready!", "input");

  // Initialize voice
  initializeVoice();

  // Add some initial instructions
  addToConsole(
    "console1",
    "Use Load Sample button to see example input",
    "input"
  );
  addToConsole(
    "console2",
    "Use Load Sample button to see example input",
    "input"
  );
  addToConsole(
    "console3",
    "Use Load Sample button to see example input",
    "input"
  );
});
