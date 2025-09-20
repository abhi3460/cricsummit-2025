/**
 * Modern Browser Application Entry Point
 * Provides web interface for cricket outcome prediction system
 */

import { CricketApp } from './app/cricket-app';
import { DependencyContainer } from './container/dependency-container';

// Types for better type safety
type ConsoleType =
  | 'input'
  | 'output'
  | 'error'
  | 'commentary'
  | 'header'
  | 'ball-header'
  | 'ball-detail'
  | 'ball-outcome'
  | 'result'
  | 'error-warning'
  | 'outcome-runs'
  | 'outcome-wicket'
  | 'outcome-dot'
  | 'outcome-boundary';
type ToastType = 'success' | 'error';

interface VoiceSettings {
  isEnabled: boolean;
  currentVoice: SpeechSynthesisVoice | null;
  speechSynthesis: SpeechSynthesis;
}

// Application state
class CricketAppBrowser {
  private cricketApp: CricketApp;
  private voice: VoiceSettings;

  constructor() {
    this.cricketApp = new CricketApp(new DependencyContainer());
    this.voice = {
      isEnabled: false,
      currentVoice: null,
      speechSynthesis: window.speechSynthesis,
    };

    this.initializeVoice();
    this.bindEventListeners();
  }

  private initializeVoice(): void {
    if (!('speechSynthesis' in window)) return;

    this.voice.speechSynthesis.onvoiceschanged = () => {
      const voices = this.voice.speechSynthesis.getVoices();

      // Priority order for Ravi Shastri-like voice selection
      this.voice.currentVoice =
        // 1. Deep male voices (preferred for authoritative commentary)
        voices.find(
          voice =>
            voice.lang.startsWith('en') &&
            (voice.name.toLowerCase().includes('male') ||
              voice.name.toLowerCase().includes('man') ||
              voice.name.toLowerCase().includes('david') ||
              voice.name.toLowerCase().includes('alex') ||
              voice.name.toLowerCase().includes('daniel'))
        ) ||
        // 2. Google voices (usually good quality)
        voices.find(
          voice => voice.lang.startsWith('en') && voice.name.includes('Google')
        ) ||
        // 3. Microsoft voices (often deeper)
        voices.find(
          voice =>
            voice.lang.startsWith('en') && voice.name.includes('Microsoft')
        ) ||
        // 4. Any English voice
        voices.find(voice => voice.lang.startsWith('en')) ||
        voices[0];
    };

    // Load voices immediately if already available
    if (this.voice.speechSynthesis.getVoices().length > 0) {
      this.voice.speechSynthesis.onvoiceschanged?.call(
        this.voice.speechSynthesis,
        new Event('voiceschanged')
      );
    }
  }

  private bindEventListeners(): void {
    // Challenge buttons
    this.bindButton('runChallenge1', () => this.runChallenge(1));
    this.bindButton('runChallenge2', () => this.runChallenge(2));
    this.bindButton('runChallenge3', () => this.runChallenge(3));

    // Sample buttons
    this.bindButton('loadSample1', () => this.loadSample(1));
    this.bindButton('loadSample2', () => this.loadSample(2));
    this.bindButton('loadSample3', () => this.loadSample(3));

    // Clear buttons
    this.bindButton('clearConsole1', () => this.clearConsole('console1'));
    this.bindButton('clearConsole2', () => this.clearConsole('console2'));
    this.bindButton('clearConsole3', () => this.clearConsole('console3'));

    // Unrealistic combination buttons
    this.bindButton('loadUnrealistic1', () => this.loadUnrealisticSample(1));
    this.bindButton('loadUnrealistic2', () => this.loadUnrealisticSample(2));
    this.bindButton('loadUnrealistic3', () => this.loadUnrealisticSample(3));

    // Voice toggle
    this.bindButton('voiceToggle', () => this.toggleVoice());

    // Accordion toggle
    this.bindButton('quickOptionsToggle', () => this.toggleAccordion());

    // Quick options buttons
    this.bindQuickOptionButtons();
  }

  private bindButton(id: string, handler: () => void): void {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener('click', handler);
    }
  }

  private bindQuickOptionButtons(): void {
    // Bowling type buttons
    document.querySelectorAll('[data-bowling]').forEach(button => {
      button.addEventListener('click', e => {
        e.preventDefault();
        const bowling = (e.target as HTMLElement).getAttribute('data-bowling');
        if (bowling) {
          this.copyToClipboard(bowling);
          this.fillInActiveTextarea(bowling + ' ');
        }
      });
    });

    // Shot type buttons
    document.querySelectorAll('[data-shot]').forEach(button => {
      button.addEventListener('click', e => {
        e.preventDefault();
        const shot = (e.target as HTMLElement).getAttribute('data-shot');
        if (shot) {
          this.copyToClipboard(shot);
          this.fillInActiveTextarea(shot + ' ');
        }
      });
    });

    // Timing buttons
    document.querySelectorAll('[data-timing]').forEach(button => {
      button.addEventListener('click', e => {
        e.preventDefault();
        const timing = (e.target as HTMLElement).getAttribute('data-timing');
        if (timing) {
          this.copyToClipboard(timing);
          this.fillInActiveTextarea(timing);
        }
      });
    });
  }

  private runChallenge(challengeNumber: 1 | 2 | 3): void {
    const input = this.getInputValue(`input${challengeNumber}`);
    if (!input) {
      this.addToConsole(
        `console${challengeNumber}`,
        'Please enter input first!',
        'error'
      );
      return;
    }

    this.clearConsole(`console${challengeNumber}`);
    this.addToConsole(
      `console${challengeNumber}`,
      `Running Challenge ${challengeNumber}`,
      'input'
    );
    this.addToConsole(`console${challengeNumber}`, 'Input:', 'input');

    const lines = input.split('\n').filter(line => line.trim());
    lines.forEach(line =>
      this.addToConsole(`console${challengeNumber}`, line, 'input')
    );

    this.addToConsole(`console${challengeNumber}`, 'Output:', 'input');

    try {
      let results: string[] = [];

      switch (challengeNumber) {
        case 1:
          results = this.cricketApp.runChallenge1(input);
          break;
        case 2:
          results = this.cricketApp.runChallenge2(input);
          break;
        case 3:
          results = this.cricketApp.runChallenge3(input);
          break;
      }

      results.forEach(result => {
        if (challengeNumber === 3) {
          // Enhanced styling for Super Over (Challenge 3)
          this.addSuperOverConsoleOutput(`console${challengeNumber}`, result);
        } else if (challengeNumber === 2) {
          // Enhanced styling for Challenge 2 (Commentary)
          this.addChallenge2ConsoleOutput(`console${challengeNumber}`, result);
        } else {
          // Enhanced styling for Challenge 1 (Outcome Prediction)
          this.addChallenge1ConsoleOutput(`console${challengeNumber}`, result);
        }
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.addToConsole(
        `console${challengeNumber}`,
        `Error: ${errorMessage}`,
        'error'
      );
    }
  }

  private loadSample(challengeNumber: 1 | 2 | 3): void {
    const sampleInput = this.cricketApp.getSampleInput(challengeNumber);
    this.setInputValue(`input${challengeNumber}`, sampleInput.join('\n'));
  }

  private loadUnrealisticSample(challengeNumber: 1 | 2 | 3): void {
    const unrealisticSamples: Record<1 | 2 | 3, string[]> = {
      1: ['Bouncer Sweep Perfect', 'Yorker UpperCut Good', 'Pace Scoop Early'],
      2: ['Bouncer Sweep Perfect', 'Doosra Scoop Good'],
      3: [
        'Sweep Perfect',
        'UpperCut Early',
        'Scoop Good',
        'Scoop Perfect',
        'Sweep Good',
        'UpperCut Perfect',
      ],
    };

    this.setInputValue(
      `input${challengeNumber}`,
      unrealisticSamples[challengeNumber].join('\n')
    );
  }

  private toggleVoice(): void {
    this.voice.isEnabled = !this.voice.isEnabled;
    const button = document.getElementById('voiceToggle');
    if (button) {
      button.textContent = this.voice.isEnabled ? '🔊' : '🔇';
      button.style.background = this.voice.isEnabled
        ? 'linear-gradient(45deg, #00ff00, #00aa00)'
        : 'linear-gradient(45deg, #666, #333)';
    }

    if (this.voice.isEnabled) {
      const voiceName = this.voice.currentVoice?.name || 'Default';
      this.speakCommentary('Voice commentary enabled!');
      this.showToast(`Voice enabled - ${voiceName}`);
    } else {
      this.voice.speechSynthesis.cancel();
      this.showToast('Voice disabled');
    }
  }

  private speakCommentary(commentary: string): void {
    if (!this.voice.isEnabled || !this.voice.speechSynthesis) return;

    this.voice.speechSynthesis.cancel();

    // Enhance commentary for Ravi Shastri-style delivery
    const enhancedCommentary = this.enhanceCommentaryForVoice(commentary);

    const utterance = new SpeechSynthesisUtterance(enhancedCommentary);
    utterance.voice = this.voice.currentVoice;

    // Optimized settings for Ravi Shastri-like commentary
    utterance.rate = 0.75; // Slower for dramatic effect and clarity
    utterance.pitch = 0.85; // Lower pitch for authoritative tone
    utterance.volume = 0.95; // Higher volume for impact

    this.voice.speechSynthesis.speak(utterance);
  }

  private enhanceCommentaryForVoice(commentary: string): string {
    // Split commentary and outcome parts
    const parts = commentary.split(' - ');
    if (parts.length !== 2) {
      // If not in expected format, return as is
      return commentary;
    }

    const [commentaryPart, outcomePart] = parts;

    // Process commentary part
    const enhancedCommentary = commentaryPart
      .replace(/\./g, '... ') // Add dramatic pauses
      .replace(/!/g, '! ') // Emphasize exclamations
      .replace(/wicket/gi, 'WICKET!') // Emphasize wickets
      .replace(/boundary/gi, 'BOUNDARY!') // Emphasize boundaries
      .replace(/six/gi, 'SIX!') // Emphasize sixes
      .replace(/four/gi, 'FOUR!'); // Emphasize fours

    // Process outcome part
    const enhancedOutcome = outcomePart
      .replace(/0 runs/gi, 'dot ball') // Convert 0 runs to dot ball
      .replace(/1 run/gi, 'a single') // Convert 1 run to single
      .replace(/2 runs/gi, 'couple of runs') // Convert 2 runs to couple
      .replace(/3 runs/gi, 'three runs') // Convert 3 runs
      .replace(/4 runs/gi, 'FOUR runs!') // Emphasize fours
      .replace(/5 runs/gi, 'five runs') // Convert 5 runs
      .replace(/6 runs/gi, 'SIX runs!') // Emphasize sixes
      .replace(/1 wicket/gi, 'WICKET!'); // Emphasize wickets

    // For wickets, only speak the commentary part (no redundant "1 wicket")
    if (outcomePart.includes('wicket')) {
      return enhancedCommentary;
    }

    // For runs, speak both parts
    return `${enhancedCommentary} - ${enhancedOutcome}`;
  }

  private fillInActiveTextarea(text: string): void {
    const activeElement = document.activeElement as HTMLTextAreaElement;
    if (activeElement && activeElement.tagName === 'TEXTAREA') {
      const cursorPos = activeElement.selectionStart;
      const textBefore = activeElement.value.substring(0, cursorPos);
      const textAfter = activeElement.value.substring(
        activeElement.selectionEnd
      );

      activeElement.value = textBefore + text + textAfter;
      activeElement.focus();
      activeElement.setSelectionRange(
        cursorPos + text.length,
        cursorPos + text.length
      );
    }
  }

  private addToConsole(
    consoleId: string,
    message: string,
    type: ConsoleType = 'output'
  ): void {
    const consoleElement = document.getElementById(consoleId);
    if (!consoleElement) return;

    const line = document.createElement('div');
    line.className = `console-line ${type}-line`;
    line.textContent = message;

    consoleElement.appendChild(line);
    consoleElement.scrollTop = consoleElement.scrollHeight;
  }

  private addChallenge1ConsoleOutput(consoleId: string, output: string): void {
    // Challenge 1: Enhanced outcome prediction formatting
    const lines = output.split('\n');

    lines.forEach(line => {
      if (!line.trim()) {
        return;
      }

      let consoleType: ConsoleType = 'output';
      let formattedLine = line;

      // Determine outcome type and format accordingly
      if (line.includes('wicket')) {
        consoleType = 'outcome-wicket';
        formattedLine = `🚨 ${line.toUpperCase()}`;
      } else if (line.includes('6 runs')) {
        consoleType = 'outcome-boundary';
        formattedLine = `🏏 SIX! ${line}`;
      } else if (line.includes('4 runs')) {
        consoleType = 'outcome-boundary';
        formattedLine = `🎯 FOUR! ${line}`;
      } else if (line.includes('runs')) {
        consoleType = 'outcome-runs';
        const runs = line.match(/\d+/)?.[0] || '';
        formattedLine = `⚡ ${runs} RUN${runs !== '1' ? 'S' : ''} - ${line}`;
      } else if (line.includes('0 runs') || line === '0 runs') {
        consoleType = 'outcome-dot';
        formattedLine = `⚫ DOT BALL - ${line}`;
      }

      this.addToConsole(consoleId, formattedLine, consoleType);
    });
  }

  private addChallenge2ConsoleOutput(consoleId: string, output: string): void {
    const lines = output.split('\n');

    lines.forEach(line => {
      if (!line.trim()) {
        // Skip empty lines
        return;
      }

      let consoleType: ConsoleType = 'output';

      // Determine the type of line based on content patterns for Challenge 2
      if (
        line.includes('-') &&
        (line.includes('runs') || line.includes('wicket'))
      ) {
        // Commentary lines with outcomes
        consoleType = 'commentary';

        // Enable voice commentary if available
        if (this.voice.isEnabled) {
          this.speakCommentary(line);
        }
      } else {
        // Regular output lines
        consoleType = 'output';
      }

      this.addToConsole(consoleId, line, consoleType);
    });
  }

  private addSuperOverConsoleOutput(consoleId: string, output: string): void {
    const lines = output.split('\n');

    lines.forEach(line => {
      if (!line.trim()) {
        // Skip empty lines
        return;
      }

      let consoleType: ConsoleType = 'output';

      // Determine the type of line based on content patterns
      if (line.includes('needs') && line.includes('runs to win')) {
        consoleType = 'header';
      } else if (line.includes('Ball-by-ball commentary:')) {
        consoleType = 'header';
      } else if (line.startsWith('Ball ') && line.includes('bowls a')) {
        consoleType = 'ball-header';
      } else if (
        line.startsWith('  ') &&
        line.includes('plays a') &&
        line.includes('shot with')
      ) {
        consoleType = 'ball-detail';
      } else if (line.startsWith('  ') && line.includes(' - ')) {
        // Check if this is a run outcome and apply appropriate styling
        const outcome = line.split(' - ')[1] || '';
        if (outcome.includes('wicket')) {
          consoleType = 'outcome-wicket';
        } else if (outcome.includes('6 runs')) {
          consoleType = 'outcome-boundary';
        } else if (outcome.includes('4 runs')) {
          consoleType = 'outcome-boundary';
        } else if (outcome.includes('0 runs')) {
          consoleType = 'outcome-dot';
        } else if (outcome.includes('runs') || outcome.includes('run')) {
          consoleType = 'outcome-runs';
        } else {
          consoleType = 'ball-outcome';
        }
      } else if (
        line.includes('scored:') ||
        line.includes('won by') ||
        line.includes('lost by')
      ) {
        consoleType = 'result';
      } else if (
        line.includes('⚠️') ||
        line.includes('Unrealistic Combinations')
      ) {
        consoleType = 'error-warning';
      } else if (
        line.includes('Note:') ||
        line.includes('Bowling shots are random')
      ) {
        consoleType = 'error-warning';
      }

      // Add icons to Super Over outcomes without changing the original text
      const enhancedLine = this.addIconsToSuperOverLine(line, consoleType);
      this.addToConsole(consoleId, enhancedLine, consoleType);
    });
  }

  private addIconsToSuperOverLine(
    line: string,
    consoleType: ConsoleType
  ): string {
    if (consoleType === 'outcome-wicket') {
      return line.replace(/(\d+ wicket)/, '🚨 $1');
    } else if (consoleType === 'outcome-boundary') {
      if (line.includes('6 runs')) {
        return line.replace(/(6 runs)/, '🏏 SIX!');
      } else if (line.includes('4 runs')) {
        return line.replace(/(4 runs)/, '🎯 FOUR!');
      }
    } else if (consoleType === 'outcome-runs') {
      const runsMatch = line.match(/(\d+) runs?/);
      if (runsMatch) {
        const runs = runsMatch[1];
        return line.replace(
          /(\d+ runs?)/,
          `⚡ ${runs} RUN${runs !== '1' ? 'S' : ''}`
        );
      }
    } else if (consoleType === 'outcome-dot') {
      return line.replace(/(0 runs)/, '⚫ DOT BALL');
    }
    return line;
  }

  private clearConsole(consoleId: string): void {
    const consoleElement = document.getElementById(consoleId);
    if (consoleElement) {
      consoleElement.innerHTML = '';
    }
  }

  private toggleAccordion(): void {
    const content = document.getElementById('quickOptionsContent');
    const icon = document.getElementById('accordionIcon');

    if (content && icon) {
      content.classList.toggle('collapsed');
      icon.classList.toggle('rotated');
    }
  }

  private async copyToClipboard(text: string): Promise<void> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        this.showToast(`Copied: "${text}"`, 'success');
      } else {
        // Fallback for older browsers using modern approach
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
            this.showToast(`Copied: "${text}"`, 'success');
          } else {
            this.showToast('❌ Copy not supported in this browser', 'error');
          }
        } catch (err) {
          console.error('Copy failed', err);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error('Copy failed', err);
    }
  }

  private showToast(message: string, type: ToastType = 'success'): void {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  private getInputValue(inputId: string): string {
    const input = document.getElementById(inputId) as HTMLTextAreaElement;
    return input?.value.trim() || '';
  }

  private setInputValue(inputId: string, value: string): void {
    const input = document.getElementById(inputId) as HTMLTextAreaElement;
    if (input) {
      input.value = value;
    }
  }

  // Public method to expose the cricket app for console debugging
  public getCricketApp(): CricketApp {
    return this.cricketApp;
  }
}

// Initialize the application when DOM is ready
let cricketAppBrowser: CricketAppBrowser;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    cricketAppBrowser = new CricketAppBrowser();
    console.log("🏏 CRICSUMMIT'25 - Modern TypeScript Cricket App Loaded!");
  });
} else {
  cricketAppBrowser = new CricketAppBrowser();
  console.log("🏏 CRICSUMMIT'25 - Modern TypeScript Cricket App Loaded!");
}

// Expose to global scope for debugging
declare global {
  interface Window {
    cricketAppBrowser: CricketAppBrowser;
  }
}

window.cricketAppBrowser = cricketAppBrowser!;

export { CricketAppBrowser };
