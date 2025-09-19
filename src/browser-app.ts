/**
 * Browser Application Entry Point
 * Exposes the TypeScript cricket app to the browser
 */

import { CricketApp } from './app/cricket-app';
import { DependencyContainer } from './container/dependency-container';

// Initialize the TypeScript cricket app
const container = new DependencyContainer();
const cricketApp = new CricketApp(container);

// Expose to browser global scope
declare global {
  interface Window {
    cricketApp: CricketApp;
    runChallenge1: () => void;
    runChallenge2: () => void;
    runChallenge3: () => void;
    loadSample1: () => void;
    loadSample2: () => void;
    loadSample3: () => void;
    clearConsole1: () => void;
    clearConsole2: () => void;
    clearConsole3: () => void;
    toggleVoice: () => void;
    fillBowling: (bowling: string) => void;
    fillShot: (shot: string) => void;
    fillTiming: (timing: string) => void;
    fillQuickTest: (challenge: string) => void;
  }
}

// Browser utility functions
function addToConsole(
  consoleId: string,
  message: string,
  type: 'input' | 'output' | 'error' | 'commentary' = 'output'
) {
  const console = document.getElementById(consoleId);
  if (!console) return;

  const line = document.createElement('div');
  line.className = `console-line ${type}-line`;

  if (message.trim()) {
    line.textContent = message;
  }

  console.appendChild(line);
  console.scrollTop = console.scrollHeight;
}

function clearConsole(consoleId: string) {
  const console = document.getElementById(consoleId);
  if (console) {
    console.innerHTML = '';
  }
}

function showToast(message: string, type: 'success' | 'error' = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
}

// Voice functionality
let voiceEnabled = false;
const speechSynthesis = window.speechSynthesis;

function speakCommentary(commentary: string) {
  if (!voiceEnabled || !speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(commentary);
  utterance.rate = 0.8;
  utterance.pitch = 1.0;
  speechSynthesis.speak(utterance);
}

// Challenge functions
function runChallenge1() {
  const input = (
    document.getElementById('input1') as HTMLTextAreaElement
  )?.value.trim();
  if (!input) {
    addToConsole('console1', 'Please enter input first!', 'error');
    return;
  }

  clearConsole('console1');
  addToConsole('console1', 'Running Challenge 1: Predict Outcome', 'input');
  addToConsole('console1', 'Input:', 'input');

  const lines = input.split('\n').filter(line => line.trim());
  lines.forEach(line => addToConsole('console1', line, 'input'));

  addToConsole('console1', 'Output:', 'input');

  try {
    const results = cricketApp.runChallenge1(input);
    results.forEach(result => addToConsole('console1', result, 'output'));
  } catch (error) {
    addToConsole(
      'console1',
      `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'error'
    );
  }
}

function runChallenge2() {
  const input = (
    document.getElementById('input2') as HTMLTextAreaElement
  )?.value.trim();
  if (!input) {
    addToConsole('console2', 'Please enter input first!', 'error');
    return;
  }

  clearConsole('console2');
  addToConsole('console2', 'Running Challenge 2: Commentary', 'input');
  addToConsole('console2', 'Input:', 'input');

  const lines = input.split('\n').filter(line => line.trim());
  lines.forEach(line => addToConsole('console2', line, 'input'));

  addToConsole('console2', 'Output:', 'input');

  try {
    const results = cricketApp.runChallenge2(input);
    results.forEach(result => {
      if (result.includes('commentary')) {
        addToConsole('console2', result, 'commentary');
        speakCommentary(result);
      } else {
        addToConsole('console2', result, 'output');
      }
    });
  } catch (error) {
    addToConsole(
      'console2',
      `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'error'
    );
  }
}

function runChallenge3() {
  const input = (
    document.getElementById('input3') as HTMLTextAreaElement
  )?.value.trim();
  if (!input) {
    addToConsole('console3', 'Please enter input first!', 'error');
    return;
  }

  clearConsole('console3');
  addToConsole('console3', 'Running Challenge 3: Super Over', 'input');
  addToConsole('console3', 'Input:', 'input');

  const lines = input.split('\n').filter(line => line.trim());
  lines.forEach(line => addToConsole('console3', line, 'input'));

  addToConsole('console3', 'Output:', 'input');

  try {
    const results = cricketApp.runChallenge3(input);
    results.forEach(result => {
      if (result.includes('commentary')) {
        addToConsole('console3', result, 'commentary');
        speakCommentary(result);
      } else {
        addToConsole('console3', result, 'output');
      }
    });
  } catch (error) {
    addToConsole(
      'console3',
      `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'error'
    );
  }
}

// Sample data functions
function loadSample1() {
  const sampleInput = cricketApp.getSampleInput(1);
  const textarea = document.getElementById('input1') as HTMLTextAreaElement;
  if (textarea) {
    textarea.value = sampleInput.join('\n');
    showToast('Sample input loaded for Challenge 1');
  }
}

function loadSample2() {
  const sampleInput = cricketApp.getSampleInput(2);
  const textarea = document.getElementById('input2') as HTMLTextAreaElement;
  if (textarea) {
    textarea.value = sampleInput.join('\n');
    showToast('Sample input loaded for Challenge 2');
  }
}

function loadSample3() {
  const sampleInput = cricketApp.getSampleInput(3);
  const textarea = document.getElementById('input3') as HTMLTextAreaElement;
  if (textarea) {
    textarea.value = sampleInput.join('\n');
    showToast('Sample input loaded for Challenge 3');
  }
}

// Clear functions
function clearConsole1() {
  clearConsole('console1');
}
function clearConsole2() {
  clearConsole('console2');
}
function clearConsole3() {
  clearConsole('console3');
}

// Voice toggle
function toggleVoice() {
  voiceEnabled = !voiceEnabled;
  const button = document.getElementById('voiceToggle');
  if (button) {
    button.textContent = voiceEnabled ? '🔊 Voice ON' : '🔇 Voice OFF';
  }
  showToast(`Voice ${voiceEnabled ? 'enabled' : 'disabled'}`);
}

// Quick fill functions for reference panel
function fillBowling(bowling: string) {
  const activeTextarea = document.activeElement as HTMLTextAreaElement;
  if (activeTextarea && activeTextarea.tagName === 'TEXTAREA') {
    const cursorPos = activeTextarea.selectionStart;
    const textBefore = activeTextarea.value.substring(0, cursorPos);
    const textAfter = activeTextarea.value.substring(
      activeTextarea.selectionEnd
    );
    activeTextarea.value = textBefore + bowling + textAfter;
    activeTextarea.focus();
    activeTextarea.setSelectionRange(
      cursorPos + bowling.length,
      cursorPos + bowling.length
    );
  }
}

function fillShot(shot: string) {
  const activeTextarea = document.activeElement as HTMLTextAreaElement;
  if (activeTextarea && activeTextarea.tagName === 'TEXTAREA') {
    const cursorPos = activeTextarea.selectionStart;
    const textBefore = activeTextarea.value.substring(0, cursorPos);
    const textAfter = activeTextarea.value.substring(
      activeTextarea.selectionEnd
    );
    activeTextarea.value = textBefore + shot + textAfter;
    activeTextarea.focus();
    activeTextarea.setSelectionRange(
      cursorPos + shot.length,
      cursorPos + shot.length
    );
  }
}

function fillTiming(timing: string) {
  const activeTextarea = document.activeElement as HTMLTextAreaElement;
  if (activeTextarea && activeTextarea.tagName === 'TEXTAREA') {
    const cursorPos = activeTextarea.selectionStart;
    const textBefore = activeTextarea.value.substring(0, cursorPos);
    const textAfter = activeTextarea.value.substring(
      activeTextarea.selectionEnd
    );
    activeTextarea.value = textBefore + timing + textAfter;
    activeTextarea.focus();
    activeTextarea.setSelectionRange(
      cursorPos + timing.length,
      cursorPos + timing.length
    );
  }
}

function fillQuickTest(challenge: string) {
  const sampleInput = cricketApp.getSampleInput(
    parseInt(challenge.replace('challenge', ''))
  );
  const textarea = document.getElementById(
    `input${challenge.replace('challenge', '')}`
  ) as HTMLTextAreaElement;
  if (textarea) {
    textarea.value = sampleInput.join('\n');
    showToast(`Quick test loaded for ${challenge}`);
  }
}

// Expose everything to the browser
window.cricketApp = cricketApp;
window.runChallenge1 = runChallenge1;
window.runChallenge2 = runChallenge2;
window.runChallenge3 = runChallenge3;
window.loadSample1 = loadSample1;
window.loadSample2 = loadSample2;
window.loadSample3 = loadSample3;
window.clearConsole1 = clearConsole1;
window.clearConsole2 = clearConsole2;
window.clearConsole3 = clearConsole3;
window.toggleVoice = toggleVoice;
window.fillBowling = fillBowling;
window.fillShot = fillShot;
window.fillTiming = fillTiming;
window.fillQuickTest = fillQuickTest;

// Initialize reference panel toggle functionality
document.addEventListener('DOMContentLoaded', () => {
  const referenceToggle = document.querySelector('[data-enum-id="reference"]');
  if (referenceToggle) {
    referenceToggle.addEventListener('click', () => {
      const content = document.getElementById('reference');
      const toggle = referenceToggle.querySelector('.enum-toggle');
      if (content && toggle) {
        content.classList.toggle('show');
        toggle.classList.toggle('rotated');
      }
    });
  }
});

console.log("🏏 CRICSUMMIT'25 - TypeScript Cricket App Loaded!");
