/**
 * Modern Browser Application Entry Point
 * Provides web interface for cricket outcome prediction system
 */

import { CricketApp } from './app/cricket-app';
import { DependencyContainer } from './container/dependency-container';

// Types for better type safety
type ConsoleType = 'input' | 'output' | 'error' | 'commentary';
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
      this.voice.currentVoice =
        voices.find(
          voice => voice.lang.startsWith('en') && voice.name.includes('Google')
        ) ||
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
        const isCommentary =
          result.includes('-') &&
          (challengeNumber === 2 || challengeNumber === 3);
        this.addToConsole(
          `console${challengeNumber}`,
          result,
          isCommentary ? 'commentary' : 'output'
        );

        if (isCommentary && this.voice.isEnabled) {
          const commentary = result.split('-')[0].trim();
          this.speakCommentary(commentary);
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
      this.speakCommentary('Voice commentary enabled!');
    } else {
      this.voice.speechSynthesis.cancel();
    }

    this.showToast(`Voice ${this.voice.isEnabled ? 'enabled' : 'disabled'}`);
  }

  private speakCommentary(commentary: string): void {
    if (!this.voice.isEnabled || !this.voice.speechSynthesis) return;

    this.voice.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(commentary);
    utterance.voice = this.voice.currentVoice;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    this.voice.speechSynthesis.speak(utterance);
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
