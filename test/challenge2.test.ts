/**
 * Test suite for Challenge 2: Commentary
 */

import { Challenge2, CommentaryOutput } from '../src/challenge2';

describe('Challenge2', () => {
  let challenge2: Challenge2;

  beforeEach(() => {
    challenge2 = new Challenge2();
  });

  describe('Sample Input/Output', () => {
    test('should match expected sample output', () => {
      const sampleInput = challenge2.getSampleInput();
      const expectedOutput = challenge2.getSampleOutput();
      const actualOutput = challenge2.processInput(sampleInput);

      expect(actualOutput).toEqual(expectedOutput);
    });

    test('should handle sample input line by line', () => {
      const sampleInput = ['Bouncer Pull Late'];
      const expectedOutput = [
        {
          commentary: "It's a wicket.",
          outcome: '1 wicket',
        },
      ];
      const actualOutput = challenge2.processInput(sampleInput);

      expect(actualOutput).toEqual(expectedOutput);
    });
  });

  describe('Commentary Generation', () => {
    test('should generate appropriate commentary for wicket outcomes', () => {
      const inputs = [
        'Yorker Straight Early', // Should result in wicket
        'Bouncer Pull Late', // Should result in wicket
      ];

      const outputs = challenge2.processInput(inputs);

      outputs.forEach(output => {
        expect(output.outcome).toBe('1 wicket');
        expect(output.commentary).toBe("It's a wicket.");
      });
    });

    test('should generate appropriate commentary for run outcomes', () => {
      const inputs = [
        'Bouncer Pull Perfect', // Should result in 6 runs
        'Pace Straight Good', // Should result in 3 runs
      ];

      const outputs = challenge2.processInput(inputs);

      expect(outputs[0].outcome).toBe('6 runs');
      expect(outputs[0].commentary).toBe(
        "That's massive and out of the ground."
      );

      expect(outputs[1].outcome).toBe('3 runs');
      expect(outputs[1].commentary).toBe('Just over the fielder.');
    });

    test('should generate appropriate commentary for boundary outcomes', () => {
      const inputs = [
        'Bouncer Pull Good', // Should result in 4 runs
        'Yorker Straight Perfect', // Should result in 4 runs
      ];

      const outputs = challenge2.processInput(inputs);

      outputs.forEach(output => {
        expect(output.outcome).toBe('4 runs');
        expect(output.commentary).toBe('Excellent line and length.');
      });
    });
  });

  describe('Output Formatting', () => {
    test('should format output correctly', () => {
      const outputs = [
        { commentary: "It's a wicket.", outcome: '1 wicket' },
        {
          commentary: "That's massive and out of the ground.",
          outcome: '6 runs',
        },
      ];

      const formatted = challenge2.formatOutput(outputs as CommentaryOutput[]);
      const expected =
        "It's a wicket. - 1 wicket\nThat's massive and out of the ground. - 6 runs";

      expect(formatted).toBe(expected);
    });
  });

  describe('String Input Processing', () => {
    test('should handle multi-line string input', () => {
      const inputString = `Bouncer Pull Late
Bouncer Pull Perfect`;

      const outputs = challenge2.processStringInput(inputString);

      expect(outputs).toHaveLength(2);
      expect(outputs[0].outcome).toBe('1 wicket');
      expect(outputs[1].outcome).toBe('6 runs');
    });

    test('should handle single line input', () => {
      const inputString = 'Bouncer Pull Late';
      const outputs = challenge2.processStringInput(inputString);

      expect(outputs).toHaveLength(1);
      expect(outputs[0].outcome).toBe('1 wicket');
      expect(outputs[0].commentary).toBe("It's a wicket.");
    });
  });

  describe('Error Handling', () => {
    test('should throw error for invalid input format', () => {
      const invalidInputs = [
        'Bouncer Pull', // Missing timing
        'Bouncer', // Missing shot and timing
        'Bouncer Pull Perfect Extra', // Too many parts
      ];

      invalidInputs.forEach(input => {
        expect(() => {
          challenge2.processInput([input]);
        }).toThrow();
      });
    });
  });

  describe('Performance', () => {
    test('should handle large input efficiently', () => {
      const largeInput: string[] = [];
      for (let i = 0; i < 1000; i++) {
        largeInput.push('Bouncer Pull Perfect');
      }

      const startTime = Date.now();
      const results = challenge2.processInput(largeInput);
      const endTime = Date.now();

      expect(results).toHaveLength(1000);
      expect(endTime - startTime).toBeLessThan(150); // Should complete in less than 150ms

      // All results should be the same for same input
      results.forEach(result => {
        expect(result.outcome).toBe('6 runs');
        expect(result.commentary).toBe("That's massive and out of the ground.");
      });
    });
  });
});
