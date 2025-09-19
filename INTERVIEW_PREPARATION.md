# 🏏 CRICSUMMIT'25 - Interview Preparation Guide

## 📋 Codebase Discussion Q&A

### **Architecture & Design Questions**

#### Q1: "Walk me through the overall architecture of your cricket simulation system."

**Answer:**
The system follows a **clean, modular architecture** based on SOLID principles:

- **Service Layer**: Three main services (`Challenge1Service`, `Challenge2Service`, `Challenge3Service`) handle business logic
- **Engine Layer**: Core engines (`OutcomeEngine`, `CommentaryEngine`) provide specialized functionality
- **Strategy Pattern**: Dynamic outcome prediction with `RuleBasedOutcomeStrategy` and `ProbabilisticOutcomeStrategy`
- **Dependency Injection**: `DependencyContainer` manages all dependencies and enables loose coupling
- **Parser Layer**: Specialized parsers for different input formats (`CricketInputParser`, `SuperOverParser`)
- **Formatter Layer**: Output formatting with `CommentaryFormatter` and `SuperOverFormatter`

The architecture separates concerns, making it testable, maintainable, and extensible.

#### Q2: "Why did you choose the Strategy Pattern for outcome prediction?"

**Answer:**
I implemented the Strategy Pattern because:

1. **Flexibility**: Can switch between rule-based and probabilistic prediction at runtime
2. **Extensibility**: Easy to add new prediction algorithms without modifying existing code
3. **Testability**: Each strategy can be unit tested independently
4. **Open/Closed Principle**: Open for extension, closed for modification
5. **Real-world Application**: Different cricket scenarios might need different prediction approaches

The `IOutcomeStrategy` interface ensures all strategies implement the same contract, while the `OutcomeEngine` delegates prediction to the current strategy.

#### Q3: "How does dependency injection work in your system?"

**Answer:**
The `DependencyContainer` implements a **simple but effective DI pattern**:

- **Centralized Management**: All dependencies are created and managed in one place
- **Lifecycle Control**: Services are instantiated once and reused
- **Strategy Switching**: Can change outcome strategies without recreating services
- **Interface-based**: Services depend on interfaces, not concrete implementations
- **Constructor Injection**: Dependencies are injected through constructors

Example:

```typescript
this.challenge1Service = new Challenge1Service(
  this.outcomeEngine, // Injected dependency
  this.cricketInputParser // Injected dependency
);
```

This enables loose coupling and makes the system highly testable.

### **Technical Implementation Questions**

#### Q4: "What's the time complexity of your outcome prediction?"

**Answer:**

- **Outcome Lookup**: **O(1)** - Uses HashMap for instant lookup
- **Input Processing**: **O(n)** where n = number of input lines
- **Commentary Generation**: **O(1)** - Direct mapping
- **Overall**: **O(n)** linear time complexity

The key optimization is the HashMap-based outcome lookup in `RuleBasedOutcomeStrategy`:

```typescript
const key = this.generateKey(bowlingType, shotType, timing);
const outcome = this.outcomeMap.get(key); // O(1) lookup
```

#### Q5: "How do you handle input validation and error handling?"

**Answer:**
I implemented **comprehensive error handling** with custom error classes:

- **Custom Error Types**: `InputValidationError`, `OutcomePredictionError`, `SuperOverError`
- **Parser Validation**: Each parser validates input format and provides detailed error messages
- **Graceful Degradation**: System continues processing valid inputs even if some fail
- **Error Context**: Errors include relevant context (input data, strategy used, etc.)
- **Cricket Realism Validation**: Fun error messages for unrealistic bowling-shot combinations
- **User-Friendly Messages**: Humorous explanations for why certain combinations don't work

Example:

```typescript
if (!parseResult.success || !parseResult.data) {
  throw new InputValidationError(parseResult.error || 'Failed to parse input', {
    inputLines,
  });
}

// Cricket realism validation
const unrealisticCombo = isUnrealisticCombination(bowlingType, shotType);
if (unrealisticCombo) {
  throw new OutcomePredictionError(unrealisticCombo.funMessage, {
    bowlingType,
    shotType,
    timing,
    reason: unrealisticCombo.reason,
    alternativeSuggestion: unrealisticCombo.alternativeSuggestion,
    isUnrealistic: true,
  });
}
```

#### Q6: "Explain the difference between your two outcome prediction strategies."

**Answer:**

**Rule-Based Strategy:**

- Uses predefined rules from configuration files
- Deterministic outcomes based on bowling-shot-timing combinations
- Fast O(1) lookup with HashMap
- Predictable and consistent results
- Good for testing and demonstration

**Probabilistic Strategy:**

- Uses mathematical probability calculations
- Considers timing multipliers, bowling difficulty, and shot risk
- More realistic and dynamic outcomes
- Includes randomness for varied results
- Better for simulation and real-world scenarios

```typescript
// Probabilistic calculation
const successProbability =
  timingMultiplier * (1 - bowlingDifficulty * 0.5) * (1 - shotRisk * 0.3);
```

### **Code Quality & Best Practices Questions**

#### Q7: "How do you ensure code quality and maintainability?"

**Answer:**
I follow several best practices:

- **TypeScript**: Full type safety with strict configuration
- **SOLID Principles**: Single responsibility, dependency inversion, open/closed
- **Comprehensive Testing**: Unit tests for individual components, integration tests for end-to-end flows
- **ESLint + Prettier**: Automated code formatting and linting
- **Documentation**: Clear JSDoc comments and README
- **Configuration-driven**: Rules externalized to config files
- **Error Handling**: Custom error classes with proper error propagation

#### Q8: "What testing strategies did you implement?"

**Answer:**
**Multi-layered testing approach**:

- **Unit Tests**: Test individual components (parsers, strategies, services) in isolation
- **Integration Tests**: Test complete workflows (Challenge 1, 2, 3) end-to-end
- **Edge Case Testing**: Boundary conditions, invalid inputs, error scenarios
- **Strategy Testing**: Both rule-based and probabilistic strategies tested separately
- **Performance Testing**: Large input processing and memory usage validation

Test coverage includes:

- ✅ Input parsing and validation
- ✅ Outcome prediction strategies
- ✅ Commentary generation
- ✅ Super Over simulation
- ✅ Error handling scenarios

### **Performance & Scalability Questions**

#### Q9: "How would you scale this system for production use?"

**Answer:**
Several scaling strategies:

1. **Caching**: Cache outcome predictions for common combinations
2. **Database**: Store rules and outcomes in database instead of in-memory maps
3. **Microservices**: Split into separate services (prediction, commentary, simulation)
4. **Load Balancing**: Handle multiple concurrent requests
5. **Configuration Management**: External configuration service for rules
6. **Monitoring**: Add metrics and logging for production monitoring
7. **API Layer**: REST/GraphQL APIs for external integration

#### Q10: "What are the memory and performance characteristics?"

**Answer:**
**Memory Usage:**

- Outcome map: Fixed size (10×10×4 = 400 combinations) = O(1)
- Processing: O(n) for n input lines
- Total: O(n) space complexity

**Performance Benchmarks:**

- 1,000 input lines: < 100ms processing time
- Memory usage: < 50MB for typical inputs
- Web interface: 60fps smooth animations

**Optimizations:**

- HashMap-based lookups for O(1) performance
- Lazy loading of strategies
- Efficient string processing and parsing

### **Problem-Solving & Decision Making Questions**

#### Q11: "How did you approach the Super Over simulation challenge?"

**Answer:**
I broke it down into manageable components:

1. **Analysis**: Identified key requirements (6 balls, 2 wickets, target chasing)
2. **Design**: Created `SuperOverParser` for shot inputs, `SuperOverFormatter` for output
3. **Implementation**: Built `Challenge3Service` with match state management
4. **Testing**: Comprehensive test cases for different scenarios
5. **Refinement**: Added realistic cricket logic and edge case handling

Key design decisions:

- Separate parser for Super Over format
- State management for wickets and runs
- Bowl-by-bowl commentary generation
- Realistic match outcome logic

#### Q12: "What challenges did you face and how did you solve them?"

**Answer:**
**Main Challenges:**

1. **Large Monolithic Classes**:
   - **Problem**: Initial code was in large, hard-to-maintain files
   - **Solution**: Refactored into focused, single-responsibility modules

2. **Magic Numbers**:
   - **Problem**: Hardcoded values scattered throughout code
   - **Solution**: Created `game-rules.ts` with named constants

3. **Tight Coupling**:
   - **Problem**: Components were tightly coupled
   - **Solution**: Implemented dependency injection and interface-based design

4. **Testing Complexity**:
   - **Problem**: Hard to test monolithic components
   - **Solution**: Added comprehensive unit tests for individual components

### **Innovation & Features Questions**

#### Q13: "What innovative features did you add to the basic requirements?"

**Answer:**
**Beyond Basic Requirements:**

1. **Voice Commentary**: Web Speech API integration for audio feedback
2. **Dynamic Strategy Switching**: Runtime strategy changes via command line
3. **Web Interface**: Interactive UI with animations and real-time testing
4. **Probabilistic Strategy**: Advanced probability-based outcome prediction
5. **Comprehensive Error Handling**: Custom error classes with detailed context
6. **Configuration-driven Rules**: External rule files for easy maintenance
7. **Performance Optimization**: O(1) lookup algorithms with benchmarking
8. **Cricket Realism Validation**: Fun error messages for unrealistic bowling-shot combinations
9. **Educational Features**: Interactive examples demonstrating cricket physics and strategy

#### Q14: "How does the web interface enhance the user experience?"

**Answer:**
**Web Interface Features:**

- **Animated Console**: Real-time output display with typing animations
- **Voice Commentary**: Toggle-able audio feedback using Web Speech API
- **Interactive Testing**: Easy input testing for all three challenges
- **Sample Data**: One-click sample input loading
- **Responsive Design**: Works on different screen sizes
- **Visual Feedback**: Clear success/error states and progress indicators
- **Fun Validation**: Interactive unrealistic combination samples with humorous error messages
- **Educational Value**: Demonstrates cricket physics through realistic and unrealistic examples

The interface makes the system accessible to non-technical users while providing a professional demonstration platform that's both functional and educational.

---

## 🧠 Data Structures & Algorithms Q&A

### **Array & String Problems**

#### Q1: "Implement a function to find the longest common subsequence between two cricket score sequences."

```typescript
function longestCommonSubsequence(seq1: number[], seq2: number[]): number[] {
  const m = seq1.length;
  const n = seq2.length;
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // Build DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (seq1[i - 1] === seq2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Reconstruct LCS
  const lcs: number[] = [];
  let i = m,
    j = n;
  while (i > 0 && j > 0) {
    if (seq1[i - 1] === seq2[j - 1]) {
      lcs.unshift(seq1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return lcs;
}
```

**Time Complexity**: O(m×n)  
**Space Complexity**: O(m×n)

#### Q2: "Design a data structure to efficiently store and query cricket match statistics."

```typescript
class CricketStats {
  private playerStats: Map<string, Map<string, number>> = new Map();
  private matchStats: Map<string, any[]> = new Map();

  // Add player performance
  addPlayerStat(playerId: string, statType: string, value: number): void {
    if (!this.playerStats.has(playerId)) {
      this.playerStats.set(playerId, new Map());
    }
    const player = this.playerStats.get(playerId)!;
    player.set(statType, (player.get(statType) || 0) + value);
  }

  // Get top performers
  getTopPerformers(
    statType: string,
    limit: number = 10
  ): Array<{ playerId: string; value: number }> {
    const performers: Array<{ playerId: string; value: number }> = [];

    for (const [playerId, stats] of this.playerStats) {
      const value = stats.get(statType) || 0;
      performers.push({ playerId, value });
    }

    return performers.sort((a, b) => b.value - a.value).slice(0, limit);
  }

  // Get player comparison
  comparePlayers(
    player1: string,
    player2: string,
    statType: string
  ): {
    player1: number;
    player2: number;
    difference: number;
  } {
    const p1Stats = this.playerStats.get(player1)?.get(statType) || 0;
    const p2Stats = this.playerStats.get(player2)?.get(statType) || 0;

    return {
      player1: p1Stats,
      player2: p2Stats,
      difference: p1Stats - p2Stats,
    };
  }
}
```

### **Tree & Graph Problems**

#### Q3: "Implement a tournament bracket system using a binary tree."

```typescript
class TournamentNode {
  constructor(
    public player: string,
    public score: number = 0,
    public left: TournamentNode | null = null,
    public right: TournamentNode | null = null
  ) {}
}

class TournamentBracket {
  private root: TournamentNode | null = null;

  // Build tournament bracket from players
  buildBracket(players: string[]): void {
    if (players.length === 0) return;

    const queue: TournamentNode[] = [];

    // Create leaf nodes
    for (const player of players) {
      queue.push(new TournamentNode(player));
    }

    // Build tree bottom-up
    while (queue.length > 1) {
      const left = queue.shift()!;
      const right = queue.shift()!;
      const winner = left.score >= right.score ? left : right;

      const parent = new TournamentNode(
        winner.player,
        winner.score,
        left,
        right
      );

      queue.push(parent);
    }

    this.root = queue[0];
  }

  // Simulate match and update scores
  playMatch(
    player1: string,
    player2: string,
    score1: number,
    score2: number
  ): void {
    this.updateScores(this.root, player1, score1);
    this.updateScores(this.root, player2, score2);
  }

  private updateScores(
    node: TournamentNode | null,
    player: string,
    score: number
  ): void {
    if (!node) return;

    if (node.player === player) {
      node.score = score;
    }

    this.updateScores(node.left, player, score);
    this.updateScores(node.right, player, score);
  }

  // Get tournament winner
  getWinner(): string | null {
    return this.root?.player || null;
  }

  // Print bracket structure
  printBracket(): void {
    this.printNode(this.root, 0);
  }

  private printNode(node: TournamentNode | null, depth: number): void {
    if (!node) return;

    const indent = '  '.repeat(depth);
    console.log(`${indent}${node.player} (${node.score})`);

    this.printNode(node.left, depth + 1);
    this.printNode(node.right, depth + 1);
  }
}
```

#### Q4: "Find the shortest path between two cricket grounds using Dijkstra's algorithm."

```typescript
class CricketGroundGraph {
  private graph: Map<string, Array<{ ground: string; distance: number }>> =
    new Map();

  addConnection(ground1: string, ground2: string, distance: number): void {
    if (!this.graph.has(ground1)) {
      this.graph.set(ground1, []);
    }
    if (!this.graph.has(ground2)) {
      this.graph.set(ground2, []);
    }

    this.graph.get(ground1)!.push({ ground: ground2, distance });
    this.graph.get(ground2)!.push({ ground: ground1, distance });
  }

  findShortestPath(
    start: string,
    end: string
  ): { path: string[]; distance: number } {
    const distances: Map<string, number> = new Map();
    const previous: Map<string, string | null> = new Map();
    const visited: Set<string> = new Set();
    const pq: Array<{ ground: string; distance: number }> = [];

    // Initialize distances
    for (const ground of this.graph.keys()) {
      distances.set(ground, ground === start ? 0 : Infinity);
      previous.set(ground, null);
    }

    pq.push({ ground: start, distance: 0 });

    while (pq.length > 0) {
      // Sort by distance (simple priority queue)
      pq.sort((a, b) => a.distance - b.distance);
      const { ground: current, distance: currentDist } = pq.shift()!;

      if (visited.has(current)) continue;
      visited.add(current);

      if (current === end) break;

      const neighbors = this.graph.get(current) || [];
      for (const { ground: neighbor, distance: edgeDist } of neighbors) {
        if (visited.has(neighbor)) continue;

        const newDist = currentDist + edgeDist;
        const currentNeighborDist = distances.get(neighbor) || Infinity;

        if (newDist < currentNeighborDist) {
          distances.set(neighbor, newDist);
          previous.set(neighbor, current);
          pq.push({ ground: neighbor, distance: newDist });
        }
      }
    }

    // Reconstruct path
    const path: string[] = [];
    let current: string | null = end;

    while (current !== null) {
      path.unshift(current);
      current = previous.get(current) || null;
    }

    return {
      path: path.length > 1 ? path : [],
      distance: distances.get(end) || Infinity,
    };
  }
}
```

### **Dynamic Programming Problems**

#### Q5: "Calculate the maximum runs a batsman can score in an over using dynamic programming."

```typescript
function maxRunsInOver(balls: number, maxRunsPerBall: number = 6): number {
  // DP[i][j] = maximum runs possible with i balls and j as max runs per ball
  const dp: number[][] = Array(balls + 1)
    .fill(null)
    .map(() => Array(maxRunsPerBall + 1).fill(0));

  // Base case: 0 balls = 0 runs
  for (let j = 0; j <= maxRunsPerBall; j++) {
    dp[0][j] = 0;
  }

  // Base case: 1 ball = max runs per ball
  for (let j = 1; j <= maxRunsPerBall; j++) {
    dp[1][j] = j;
  }

  // Fill DP table
  for (let i = 2; i <= balls; i++) {
    for (let j = 1; j <= maxRunsPerBall; j++) {
      // For each possible runs on current ball (0 to j)
      for (let runs = 0; runs <= j; runs++) {
        dp[i][j] = Math.max(dp[i][j], runs + dp[i - 1][j]);
      }
    }
  }

  return dp[balls][maxRunsPerBall];
}

// Optimized version
function maxRunsInOverOptimized(balls: number): number {
  return balls * 6; // Maximum possible runs
}

// With constraints (e.g., no consecutive 6s)
function maxRunsWithConstraints(balls: number): number {
  if (balls === 0) return 0;
  if (balls === 1) return 6;

  const dp: number[] = Array(balls + 1).fill(0);
  dp[1] = 6; // Can hit 6 on first ball

  for (let i = 2; i <= balls; i++) {
    // If previous ball was 6, current ball can be 0-5
    // If previous ball was not 6, current ball can be 0-6
    dp[i] = Math.max(
      dp[i - 1] + 5, // Previous was 6, current max 5
      dp[i - 1] + 6 // Previous was not 6, current max 6
    );
  }

  return dp[balls];
}
```

#### Q6: "Find the minimum number of balls needed to reach a target score."

```typescript
function minBallsToTarget(
  target: number,
  runOptions: number[] = [0, 1, 2, 3, 4, 6]
): number {
  const dp: number[] = Array(target + 1).fill(Infinity);
  dp[0] = 0; // 0 runs in 0 balls

  for (let runs = 1; runs <= target; runs++) {
    for (const option of runOptions) {
      if (option <= runs) {
        dp[runs] = Math.min(dp[runs], dp[runs - option] + 1);
      }
    }
  }

  return dp[target] === Infinity ? -1 : dp[target];
}

// With memoization for recursive approach
function minBallsToTargetMemo(
  target: number,
  memo: Map<number, number> = new Map()
): number {
  if (target === 0) return 0;
  if (target < 0) return Infinity;
  if (memo.has(target)) return memo.get(target)!;

  const runOptions = [1, 2, 3, 4, 6];
  let minBalls = Infinity;

  for (const runs of runOptions) {
    const balls = 1 + minBallsToTargetMemo(target - runs, memo);
    minBalls = Math.min(minBalls, balls);
  }

  memo.set(target, minBalls);
  return minBalls;
}
```

### **Hash Table & Set Problems**

#### Q7: "Implement a cricket team management system with efficient player lookup."

```typescript
class CricketTeamManager {
  private players: Map<string, Player> = new Map();
  private teams: Map<string, Set<string>> = new Map();
  private playerStats: Map<string, Map<string, number>> = new Map();

  addPlayer(player: Player): void {
    this.players.set(player.id, player);
    this.playerStats.set(player.id, new Map());
  }

  addPlayerToTeam(playerId: string, teamName: string): void {
    if (!this.teams.has(teamName)) {
      this.teams.set(teamName, new Set());
    }
    this.teams.get(teamName)!.add(playerId);
  }

  getPlayersByRole(role: string): Player[] {
    const result: Player[] = [];
    for (const player of this.players.values()) {
      if (player.role === role) {
        result.push(player);
      }
    }
    return result;
  }

  getTeamPlayers(teamName: string): Player[] {
    const playerIds = this.teams.get(teamName);
    if (!playerIds) return [];

    const players: Player[] = [];
    for (const playerId of playerIds) {
      const player = this.players.get(playerId);
      if (player) players.push(player);
    }
    return players;
  }

  updatePlayerStat(playerId: string, statType: string, value: number): void {
    const stats = this.playerStats.get(playerId);
    if (stats) {
      stats.set(statType, (stats.get(statType) || 0) + value);
    }
  }

  getTopPerformers(
    statType: string,
    limit: number = 5
  ): Array<{ player: Player; value: number }> {
    const performers: Array<{ player: Player; value: number }> = [];

    for (const [playerId, stats] of this.playerStats) {
      const value = stats.get(statType) || 0;
      const player = this.players.get(playerId);
      if (player) {
        performers.push({ player, value });
      }
    }

    return performers.sort((a, b) => b.value - a.value).slice(0, limit);
  }
}

interface Player {
  id: string;
  name: string;
  role: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper';
  age: number;
  country: string;
}
```

### **Sorting & Searching Problems**

#### Q8: "Sort cricket players by multiple criteria (runs, average, strike rate)."

```typescript
interface PlayerStats {
  name: string;
  runs: number;
  average: number;
  strikeRate: number;
  matches: number;
}

class PlayerSorter {
  // Multi-criteria sorting
  sortPlayers(players: PlayerStats[], criteria: string[]): PlayerStats[] {
    return players.sort((a, b) => {
      for (const criterion of criteria) {
        const comparison = this.compareByCriterion(a, b, criterion);
        if (comparison !== 0) return comparison;
      }
      return 0;
    });
  }

  private compareByCriterion(
    a: PlayerStats,
    b: PlayerStats,
    criterion: string
  ): number {
    switch (criterion) {
      case 'runs':
        return b.runs - a.runs; // Descending
      case 'average':
        return b.average - a.average; // Descending
      case 'strikeRate':
        return b.strikeRate - a.strikeRate; // Descending
      case 'matches':
        return b.matches - a.matches; // Descending
      default:
        return 0;
    }
  }

  // Binary search for finding players in sorted list
  findPlayerByRuns(
    players: PlayerStats[],
    targetRuns: number
  ): PlayerStats | null {
    const sortedPlayers = this.sortPlayers([...players], ['runs']);

    let left = 0;
    let right = sortedPlayers.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (sortedPlayers[mid].runs === targetRuns) {
        return sortedPlayers[mid];
      } else if (sortedPlayers[mid].runs < targetRuns) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    return null;
  }

  // Find players within a range
  findPlayersInRange(
    players: PlayerStats[],
    minRuns: number,
    maxRuns: number
  ): PlayerStats[] {
    return players.filter(
      player => player.runs >= minRuns && player.runs <= maxRuns
    );
  }
}
```

### **Advanced Algorithm Problems**

#### Q9: "Implement a cricket match simulation using Monte Carlo method."

```typescript
class CricketMatchSimulator {
  private playerProbabilities: Map<string, Map<string, number>> = new Map();

  setPlayerProbability(
    playerId: string,
    outcome: string,
    probability: number
  ): void {
    if (!this.playerProbabilities.has(playerId)) {
      this.playerProbabilities.set(playerId, new Map());
    }
    this.playerProbabilities.get(playerId)!.set(outcome, probability);
  }

  simulateBall(playerId: string): string {
    const probabilities = this.playerProbabilities.get(playerId);
    if (!probabilities) return 'dot';

    const random = Math.random();
    let cumulativeProbability = 0;

    for (const [outcome, probability] of probabilities) {
      cumulativeProbability += probability;
      if (random <= cumulativeProbability) {
        return outcome;
      }
    }

    return 'dot'; // Default outcome
  }

  simulateOver(playerId: string): { runs: number; wickets: number } {
    let runs = 0;
    let wickets = 0;

    for (let ball = 0; ball < 6; ball++) {
      const outcome = this.simulateBall(playerId);

      switch (outcome) {
        case '1':
          runs += 1;
          break;
        case '2':
          runs += 2;
          break;
        case '3':
          runs += 3;
          break;
        case '4':
          runs += 4;
          break;
        case '6':
          runs += 6;
          break;
        case 'wicket':
          wickets += 1;
          break;
        default:
          break; // dot ball
      }
    }

    return { runs, wickets };
  }

  simulateMatch(
    team1: string[],
    team2: string[],
    overs: number = 20
  ): {
    team1Score: number;
    team2Score: number;
    winner: string;
  } {
    let team1Score = 0;
    let team2Score = 0;

    // Simulate team1 batting
    for (let over = 0; over < overs; over++) {
      const batsman = team1[over % team1.length];
      const overResult = this.simulateOver(batsman);
      team1Score += overResult.runs;
    }

    // Simulate team2 batting
    for (let over = 0; over < overs; over++) {
      const batsman = team2[over % team2.length];
      const overResult = this.simulateOver(batsman);
      team2Score += overResult.runs;
    }

    return {
      team1Score,
      team2Score,
      winner: team1Score > team2Score ? 'Team1' : 'Team2',
    };
  }

  // Monte Carlo simulation with multiple iterations
  monteCarloSimulation(
    team1: string[],
    team2: string[],
    iterations: number = 1000
  ): {
    team1WinProbability: number;
    team2WinProbability: number;
    averageScore: { team1: number; team2: number };
  } {
    let team1Wins = 0;
    let team2Wins = 0;
    let totalTeam1Score = 0;
    let totalTeam2Score = 0;

    for (let i = 0; i < iterations; i++) {
      const result = this.simulateMatch(team1, team2);
      totalTeam1Score += result.team1Score;
      totalTeam2Score += result.team2Score;

      if (result.winner === 'Team1') {
        team1Wins++;
      } else {
        team2Wins++;
      }
    }

    return {
      team1WinProbability: team1Wins / iterations,
      team2WinProbability: team2Wins / iterations,
      averageScore: {
        team1: totalTeam1Score / iterations,
        team2: totalTeam2Score / iterations,
      },
    };
  }
}
```

#### Q10: "Design a system to find the optimal batting order using genetic algorithm."

```typescript
class BattingOrderOptimizer {
  private populationSize = 100;
  private generations = 50;
  private mutationRate = 0.1;
  private crossoverRate = 0.8;

  optimizeBattingOrder(players: Player[], targetScore: number): Player[] {
    // Initialize population
    let population = this.initializePopulation(players);

    for (let generation = 0; generation < this.generations; generation++) {
      // Evaluate fitness
      const fitnessScores = population.map(order =>
        this.evaluateFitness(order, targetScore)
      );

      // Selection
      const selected = this.selection(population, fitnessScores);

      // Crossover
      const offspring = this.crossover(selected);

      // Mutation
      const mutated = this.mutation(offspring);

      // Replace population
      population = mutated;
    }

    // Return best solution
    const finalFitness = population.map(order =>
      this.evaluateFitness(order, targetScore)
    );
    const bestIndex = finalFitness.indexOf(Math.max(...finalFitness));

    return population[bestIndex];
  }

  private initializePopulation(players: Player[]): Player[][] {
    const population: Player[][] = [];

    for (let i = 0; i < this.populationSize; i++) {
      const shuffled = [...players].sort(() => Math.random() - 0.5);
      population.push(shuffled);
    }

    return population;
  }

  private evaluateFitness(battingOrder: Player[], targetScore: number): number {
    // Simulate innings with this batting order
    const simulatedScore = this.simulateInnings(battingOrder);

    // Fitness based on how close we get to target
    const scoreDifference = Math.abs(simulatedScore - targetScore);
    return 1 / (1 + scoreDifference); // Higher fitness for closer scores
  }

  private simulateInnings(battingOrder: Player[]): number {
    let totalRuns = 0;
    let wickets = 0;
    let currentBatsman = 0;

    // Simulate 20 overs
    for (let over = 0; over < 20 && wickets < 10; over++) {
      for (let ball = 0; ball < 6 && wickets < 10; ball++) {
        const batsman = battingOrder[currentBatsman % battingOrder.length];
        const outcome = this.simulateBall(batsman);

        if (outcome === 'wicket') {
          wickets++;
          currentBatsman++;
        } else {
          totalRuns += parseInt(outcome) || 0;
        }
      }
    }

    return totalRuns;
  }

  private simulateBall(player: Player): string {
    // Simplified ball simulation based on player stats
    const random = Math.random();

    if (random < 0.1) return 'wicket';
    if (random < 0.3) return '1';
    if (random < 0.5) return '2';
    if (random < 0.7) return '4';
    if (random < 0.8) return '6';
    return '0';
  }

  private selection(
    population: Player[][],
    fitnessScores: number[]
  ): Player[][] {
    const selected: Player[][] = [];
    const totalFitness = fitnessScores.reduce((sum, score) => sum + score, 0);

    for (let i = 0; i < this.populationSize; i++) {
      const random = Math.random() * totalFitness;
      let cumulativeFitness = 0;

      for (let j = 0; j < population.length; j++) {
        cumulativeFitness += fitnessScores[j];
        if (random <= cumulativeFitness) {
          selected.push(population[j]);
          break;
        }
      }
    }

    return selected;
  }

  private crossover(selected: Player[][]): Player[][] {
    const offspring: Player[][] = [];

    for (let i = 0; i < selected.length; i += 2) {
      if (i + 1 < selected.length && Math.random() < this.crossoverRate) {
        const [child1, child2] = this.performCrossover(
          selected[i],
          selected[i + 1]
        );
        offspring.push(child1, child2);
      } else {
        offspring.push(selected[i], selected[i + 1] || selected[i]);
      }
    }

    return offspring;
  }

  private performCrossover(
    parent1: Player[],
    parent2: Player[]
  ): [Player[], Player[]] {
    const crossoverPoint = Math.floor(Math.random() * parent1.length);

    const child1 = [...parent1.slice(0, crossoverPoint)];
    const child2 = [...parent2.slice(0, crossoverPoint)];

    // Add remaining players from other parent, avoiding duplicates
    for (const player of parent2) {
      if (!child1.includes(player)) {
        child1.push(player);
      }
    }

    for (const player of parent1) {
      if (!child2.includes(player)) {
        child2.push(player);
      }
    }

    return [child1, child2];
  }

  private mutation(offspring: Player[][]): Player[][] {
    return offspring.map(order => {
      if (Math.random() < this.mutationRate) {
        return this.performMutation(order);
      }
      return order;
    });
  }

  private performMutation(order: Player[]): Player[] {
    const mutated = [...order];
    const i = Math.floor(Math.random() * mutated.length);
    const j = Math.floor(Math.random() * mutated.length);

    // Swap two players
    [mutated[i], mutated[j]] = [mutated[j], mutated[i]];

    return mutated;
  }
}
```

---

## 💻 JavaScript & TypeScript Q&A

### **JavaScript Fundamentals**

#### Q1: "Explain the difference between `var`, `let`, and `const` in JavaScript."

**Answer:**

```typescript
// var - Function scoped, hoisted, can be redeclared
function example() {
  console.log(x); // undefined (hoisted but not initialized)
  var x = 1;
  var x = 2; // Can redeclare
  console.log(x); // 2
}

// let - Block scoped, hoisted but not initialized, cannot redeclare
function example() {
  console.log(y); // ReferenceError: Cannot access 'y' before initialization
  let y = 1;
  let y = 2; // SyntaxError: Identifier 'y' has already been declared
}

// const - Block scoped, must be initialized, cannot reassign
const z = 1;
z = 2; // TypeError: Assignment to constant variable

// Block scoping example
{
  var a = 1;
  let b = 2;
  const c = 3;
}
console.log(a); // 1 (accessible)
console.log(b); // ReferenceError: b is not defined
console.log(c); // ReferenceError: c is not defined
```

#### Q2: "What are closures and how do they work? Provide a practical example."

**Answer:**
Closures allow functions to access variables from their outer scope even after the outer function has returned.

```typescript
// Basic closure example
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const counter1 = createCounter();
const counter2 = createCounter();

console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter2()); // 1 (separate closure)

// Practical example: Cricket score tracker
function createScoreTracker() {
  let totalRuns = 0;
  let wickets = 0;

  return {
    addRuns: (runs: number) => {
      totalRuns += runs;
      return totalRuns;
    },
    addWicket: () => {
      wickets++;
      return wickets;
    },
    getScore: () => ({ runs: totalRuns, wickets }),
    reset: () => {
      totalRuns = 0;
      wickets = 0;
    },
  };
}

const match1 = createScoreTracker();
match1.addRuns(4);
match1.addWicket();
console.log(match1.getScore()); // { runs: 4, wickets: 1 }
```

#### Q3: "Explain the `this` keyword in JavaScript and its different binding contexts."

**Answer:**

```typescript
// 1. Default binding (global object in non-strict mode)
function globalFunction() {
  console.log(this); // Window object (browser) or global (Node.js)
}

// 2. Implicit binding (object method)
const cricketPlayer = {
  name: 'Virat Kohli',
  score: 0,
  addRuns: function (runs: number) {
    this.score += runs;
    console.log(`${this.name} scored ${runs} runs. Total: ${this.score}`);
  },
};

cricketPlayer.addRuns(4); // this = cricketPlayer

// 3. Explicit binding (call, apply, bind)
function greet() {
  console.log(`Hello, I'm ${this.name}`);
}

const player1 = { name: 'Sachin' };
const player2 = { name: 'Dhoni' };

greet.call(player1); // Hello, I'm Sachin
greet.apply(player2); // Hello, I'm Dhoni

const boundGreet = greet.bind(player1);
boundGreet(); // Hello, I'm Sachin

// 4. Arrow functions (lexical this)
const cricketTeam = {
  players: ['Player1', 'Player2'],
  showPlayers: function () {
    // Regular function - this refers to cricketTeam
    this.players.forEach(function (player) {
      console.log(this); // Window object (not cricketTeam)
    });

    // Arrow function - this refers to cricketTeam
    this.players.forEach(player => {
      console.log(this); // cricketTeam object
    });
  },
};
```

#### Q4: "What are Promises and how do they work? Show async/await usage."

**Answer:**

```typescript
// Promise basics
function fetchCricketData(playerId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (playerId === 'valid') {
        resolve({ name: 'Virat Kohli', runs: 12000 });
      } else {
        reject(new Error('Player not found'));
      }
    }, 1000);
  });
}

// Using .then() and .catch()
fetchCricketData('valid')
  .then(data => {
    console.log('Player data:', data);
    return fetchCricketData('another');
  })
  .then(data => console.log('Another player:', data))
  .catch(error => console.error('Error:', error.message));

// Using async/await
async function getPlayerStats() {
  try {
    const player1 = await fetchCricketData('valid');
    console.log('Player 1:', player1);

    const player2 = await fetchCricketData('another');
    console.log('Player 2:', player2);
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

// Parallel execution with Promise.all
async function getMultiplePlayers() {
  try {
    const [player1, player2, player3] = await Promise.all([
      fetchCricketData('player1'),
      fetchCricketData('player2'),
      fetchCricketData('player3'),
    ]);

    console.log('All players:', { player1, player2, player3 });
  } catch (error) {
    console.error('One or more requests failed:', error);
  }
}

// Promise.allSettled (doesn't fail if one promise rejects)
async function getAllPlayersSettled() {
  const results = await Promise.allSettled([
    fetchCricketData('player1'),
    fetchCricketData('invalid'),
    fetchCricketData('player3'),
  ]);

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`Player ${index + 1}:`, result.value);
    } else {
      console.log(`Player ${index + 1} failed:`, result.reason);
    }
  });
}
```

### **TypeScript Advanced Concepts**

#### Q5: "Explain TypeScript generics and provide practical examples."

**Answer:**

```typescript
// Basic generic function
function identity<T>(arg: T): T {
  return arg;
}

const stringResult = identity<string>('Hello');
const numberResult = identity<number>(42);
const inferredResult = identity('TypeScript'); // Type inferred as string

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface CricketPlayer {
  id: string;
  name: string;
  runs: number;
}

interface Team {
  id: string;
  name: string;
  players: CricketPlayer[];
}

// Usage
const playerResponse: ApiResponse<CricketPlayer> = {
  data: { id: '1', name: 'Virat Kohli', runs: 12000 },
  status: 200,
  message: 'Success',
};

const teamResponse: ApiResponse<Team> = {
  data: { id: '1', name: 'India', players: [] },
  status: 200,
  message: 'Success',
};

// Generic class
class DataStore<T> {
  private data: T[] = [];

  add(item: T): void {
    this.data.push(item);
  }

  get(index: number): T | undefined {
    return this.data[index];
  }

  getAll(): T[] {
    return [...this.data];
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this.data.filter(predicate);
  }
}

// Usage
const playerStore = new DataStore<CricketPlayer>();
playerStore.add({ id: '1', name: 'Sachin', runs: 15000 });
playerStore.add({ id: '2', name: 'Dhoni', runs: 10000 });

const topScorers = playerStore.filter(player => player.runs > 11000);

// Generic constraints
interface HasRuns {
  runs: number;
}

function getTopScorer<T extends HasRuns>(players: T[]): T {
  return players.reduce((top, current) =>
    current.runs > top.runs ? current : top
  );
}

// Utility types
type PartialPlayer = Partial<CricketPlayer>; // All properties optional
type RequiredPlayer = Required<CricketPlayer>; // All properties required
type PlayerName = Pick<CricketPlayer, 'name'>; // Only name property
type PlayerWithoutId = Omit<CricketPlayer, 'id'>; // All except id
```

#### Q6: "What are TypeScript decorators and how do you use them?"

**Answer:**

```typescript
// Class decorator
function LogClass(target: any) {
  console.log(`Class ${target.name} is being defined`);
  return target;
}

// Method decorator
function LogMethod(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  const method = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyName} with args:`, args);
    const result = method.apply(this, args);
    console.log(`${propertyName} returned:`, result);
    return result;
  };
}

// Property decorator
function LogProperty(target: any, propertyName: string) {
  let value: any;

  const getter = function () {
    console.log(`Getting ${propertyName}:`, value);
    return value;
  };

  const setter = function (newValue: any) {
    console.log(`Setting ${propertyName} to:`, newValue);
    value = newValue;
  };

  Object.defineProperty(target, propertyName, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true,
  });
}

// Parameter decorator
function Validate(target: any, propertyName: string, parameterIndex: number) {
  const existingParameters =
    Reflect.getMetadata('validate', target, propertyName) || [];
  existingParameters.push(parameterIndex);
  Reflect.defineMetadata('validate', existingParameters, target, propertyName);
}

// Usage
@LogClass
class CricketMatch {
  @LogProperty
  private score: number = 0;

  @LogMethod
  addRuns(@Validate runs: number): void {
    if (runs < 0) {
      throw new Error('Runs cannot be negative');
    }
    this.score += runs;
  }

  @LogMethod
  getScore(): number {
    return this.score;
  }
}

// Practical example: API endpoint decorator
function ApiEndpoint(method: string, path: string) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      console.log(`API Call: ${method} ${path}`);
      try {
        const result = await originalMethod.apply(this, args);
        console.log(`API Success: ${method} ${path}`);
        return result;
      } catch (error) {
        console.error(`API Error: ${method} ${path}`, error);
        throw error;
      }
    };
  };
}

class CricketApi {
  @ApiEndpoint('GET', '/players')
  async getPlayers(): Promise<CricketPlayer[]> {
    // API implementation
    return [];
  }

  @ApiEndpoint('POST', '/players')
  async createPlayer(player: CricketPlayer): Promise<CricketPlayer> {
    // API implementation
    return player;
  }
}
```

### **JavaScript Advanced Topics**

#### Q7: "Explain the Event Loop and how asynchronous JavaScript works."

**Answer:**

```typescript
// Event Loop demonstration
console.log('1. Synchronous code starts');

setTimeout(() => {
  console.log('4. setTimeout callback (Macro Task)');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Promise callback (Micro Task)');
});

console.log('2. Synchronous code ends');

// Output:
// 1. Synchronous code starts
// 2. Synchronous code ends
// 3. Promise callback (Micro Task)
// 4. setTimeout callback (Macro Task)

// Cricket match simulation with different async patterns
class CricketMatchSimulator {
  private score: number = 0;
  private balls: number = 0;

  // Using setTimeout for ball-by-ball simulation
  simulateBallWithTimeout(): Promise<number> {
    return new Promise(resolve => {
      setTimeout(() => {
        const runs = Math.floor(Math.random() * 7); // 0-6 runs
        this.score += runs;
        this.balls++;
        console.log(`Ball ${this.balls}: ${runs} runs. Total: ${this.score}`);
        resolve(runs);
      }, 1000); // 1 second delay
    });
  }

  // Using setInterval for continuous simulation
  startContinuousSimulation(duration: number): void {
    const interval = setInterval(() => {
      const runs = Math.floor(Math.random() * 7);
      this.score += runs;
      this.balls++;
      console.log(`Ball ${this.balls}: ${runs} runs. Total: ${this.score}`);

      if (this.balls >= duration) {
        clearInterval(interval);
        console.log(`Simulation complete. Final score: ${this.score}`);
      }
    }, 500);
  }

  // Using requestAnimationFrame for smooth animations
  animateScoreUpdate(targetScore: number): void {
    const animate = () => {
      if (this.score < targetScore) {
        this.score += 1;
        console.log(`Score: ${this.score}`);
        requestAnimationFrame(animate);
      } else {
        console.log(`Animation complete. Final score: ${this.score}`);
      }
    };
    requestAnimationFrame(animate);
  }
}

// Web Workers for heavy computation
// main.js
const worker = new Worker('cricket-worker.js');

worker.postMessage({ type: 'SIMULATE_MATCH', iterations: 10000 });

worker.onmessage = function (event) {
  const { type, data } = event.data;
  if (type === 'SIMULATION_COMPLETE') {
    console.log('Simulation results:', data);
  }
};

// cricket-worker.js
self.onmessage = function (event) {
  const { type, iterations } = event.data;

  if (type === 'SIMULATE_MATCH') {
    const results = simulateMatches(iterations);
    self.postMessage({
      type: 'SIMULATION_COMPLETE',
      data: results,
    });
  }
};

function simulateMatches(iterations: number) {
  const results = [];
  for (let i = 0; i < iterations; i++) {
    // Heavy computation
    const score = Math.floor(Math.random() * 200);
    results.push(score);
  }
  return results;
}
```

#### Q8: "What are JavaScript modules and how do you implement them?"

**Answer:**

```typescript
// ES6 Modules

// cricket-player.ts (named exports)
export interface CricketPlayer {
  id: string;
  name: string;
  runs: number;
  average: number;
}

export class Player {
  constructor(public data: CricketPlayer) {}

  getStrikeRate(): number {
    return (this.data.runs / 100) * 100; // Simplified calculation
  }
}

export const DEFAULT_PLAYER: CricketPlayer = {
  id: '0',
  name: 'Unknown',
  runs: 0,
  average: 0,
};

// cricket-team.ts (default export)
import { CricketPlayer, Player } from './cricket-player.js';

export default class CricketTeam {
  private players: Player[] = [];

  addPlayer(playerData: CricketPlayer): void {
    this.players.push(new Player(playerData));
  }

  getTotalRuns(): number {
    return this.players.reduce((total, player) => total + player.data.runs, 0);
  }

  getTopScorer(): Player | null {
    if (this.players.length === 0) return null;

    return this.players.reduce((top, current) =>
      current.data.runs > top.data.runs ? current : top
    );
  }
}

// cricket-match.ts (mixed exports)
import CricketTeam from './cricket-team.js';
import { CricketPlayer } from './cricket-player.js';

export class CricketMatch {
  constructor(
    public team1: CricketTeam,
    public team2: CricketTeam
  ) {}

  simulate(): { winner: string; team1Score: number; team2Score: number } {
    const team1Score = this.team1.getTotalRuns();
    const team2Score = this.team2.getTotalRuns();

    return {
      winner: team1Score > team2Score ? 'Team 1' : 'Team 2',
      team1Score,
      team2Score,
    };
  }
}

// Re-exporting
export { CricketPlayer, Player } from './cricket-player.js';
export { default as Team } from './cricket-team.js';

// Dynamic imports
async function loadCricketModule() {
  try {
    const module = await import('./cricket-match.js');
    const { CricketMatch } = module;

    // Use the dynamically imported module
    const match = new CricketMatch(team1, team2);
    return match.simulate();
  } catch (error) {
    console.error('Failed to load cricket module:', error);
  }
}

// CommonJS compatibility (if needed)
// cricket-utils.js
function calculateAverage(runs: number, matches: number): number {
  return matches > 0 ? runs / matches : 0;
}

function formatScore(runs: number, wickets: number): string {
  return `${runs}/${wickets}`;
}

module.exports = {
  calculateAverage,
  formatScore,
};

// Usage in TypeScript
import * as utils from './cricket-utils.js';
const average = utils.calculateAverage(1000, 20);
```

---

## ⚛️ React Q&A

### **React Fundamentals**

#### Q9: "Explain React hooks and provide examples of custom hooks."

**Answer:**

```typescript
// Basic hooks
import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface CricketPlayer {
  id: string;
  name: string;
  runs: number;
  average: number;
}

// useState hook
function PlayerStats() {
  const [players, setPlayers] = useState<CricketPlayer[]>([]);
  const [loading, setLoading] = useState(false);

  const addPlayer = (player: CricketPlayer) => {
    setPlayers(prev => [...prev, player]);
  };

  return (
    <div>
      {loading ? <p>Loading...</p> : null}
      {players.map(player => (
        <div key={player.id}>
          {player.name}: {player.runs} runs
        </div>
      ))}
    </div>
  );
}

// useEffect hook
function CricketMatch() {
  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState(0);

  useEffect(() => {
    // Component did mount
    console.log('Match started');

    // Cleanup function
    return () => {
      console.log('Match ended');
    };
  }, []); // Empty dependency array = run once

  useEffect(() => {
    // Run when score changes
    if (score > 100) {
      console.log('Century reached!');
    }
  }, [score]); // Dependency array with score

  useEffect(() => {
    // Run when balls change
    if (balls >= 6) {
      console.log('Over completed');
    }
  }, [balls]);

  return (
    <div>
      <p>Score: {score}</p>
      <p>Balls: {balls}</p>
      <button onClick={() => setScore(score + 4)}>Hit 4</button>
      <button onClick={() => setBalls(balls + 1)}>Next Ball</button>
    </div>
  );
}

// useCallback hook
function PlayerList({ players }: { players: CricketPlayer[] }) {
  const [filter, setFilter] = useState('');

  // Memoized callback to prevent unnecessary re-renders
  const handlePlayerClick = useCallback((playerId: string) => {
    console.log('Player clicked:', playerId);
  }, []);

  // Memoized filtered players
  const filteredPlayers = useMemo(() => {
    return players.filter(player =>
      player.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [players, filter]);

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter players..."
      />
      {filteredPlayers.map(player => (
        <div
          key={player.id}
          onClick={() => handlePlayerClick(player.id)}
        >
          {player.name}
        </div>
      ))}
    </div>
  );
}

// Custom hook
function useCricketStats(initialScore: number = 0) {
  const [score, setScore] = useState(initialScore);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(0);

  const addRuns = useCallback((runs: number) => {
    setScore(prev => prev + runs);
    setBalls(prev => prev + 1);
  }, []);

  const addWicket = useCallback(() => {
    setWickets(prev => prev + 1);
    setBalls(prev => prev + 1);
  }, []);

  const reset = useCallback(() => {
    setScore(0);
    setWickets(0);
    setBalls(0);
  }, []);

  const isOverComplete = useMemo(() => balls >= 6, [balls]);

  return {
    score,
    wickets,
    balls,
    addRuns,
    addWicket,
    reset,
    isOverComplete
  };
}

// Using custom hook
function CricketScoreboard() {
  const { score, wickets, balls, addRuns, addWicket, reset, isOverComplete } = useCricketStats();

  return (
    <div>
      <h2>Cricket Scoreboard</h2>
      <p>Score: {score}/{wickets}</p>
      <p>Balls: {balls}</p>
      {isOverComplete && <p>Over Complete!</p>}

      <div>
        <button onClick={() => addRuns(1)}>1 Run</button>
        <button onClick={() => addRuns(4)}>4 Runs</button>
        <button onClick={() => addRuns(6)}>6 Runs</button>
        <button onClick={addWicket}>Wicket</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
```

#### Q10: "Explain React context and how to use it effectively."

**Answer:**

```typescript
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
interface CricketPlayer {
  id: string;
  name: string;
  runs: number;
  average: number;
}

interface CricketState {
  players: CricketPlayer[];
  currentMatch: {
    team1: string[];
    team2: string[];
    score: number;
    wickets: number;
  };
  loading: boolean;
  error: string | null;
}

// Actions
type CricketAction =
  | { type: 'ADD_PLAYER'; payload: CricketPlayer }
  | { type: 'REMOVE_PLAYER'; payload: string }
  | { type: 'UPDATE_SCORE'; payload: number }
  | { type: 'ADD_WICKET' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_MATCH' };

// Initial state
const initialState: CricketState = {
  players: [],
  currentMatch: {
    team1: [],
    team2: [],
    score: 0,
    wickets: 0
  },
  loading: false,
  error: null
};

// Reducer
function cricketReducer(state: CricketState, action: CricketAction): CricketState {
  switch (action.type) {
    case 'ADD_PLAYER':
      return {
        ...state,
        players: [...state.players, action.payload]
      };

    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter(player => player.id !== action.payload)
      };

    case 'UPDATE_SCORE':
      return {
        ...state,
        currentMatch: {
          ...state.currentMatch,
          score: state.currentMatch.score + action.payload
        }
      };

    case 'ADD_WICKET':
      return {
        ...state,
        currentMatch: {
          ...state.currentMatch,
          wickets: state.currentMatch.wickets + 1
        }
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };

    case 'RESET_MATCH':
      return {
        ...state,
        currentMatch: {
          team1: [],
          team2: [],
          score: 0,
          wickets: 0
        }
      };

    default:
      return state;
  }
}

// Context
const CricketContext = createContext<{
  state: CricketState;
  dispatch: React.Dispatch<CricketAction>;
} | null>(null);

// Provider component
export function CricketProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cricketReducer, initialState);

  return (
    <CricketContext.Provider value={{ state, dispatch }}>
      {children}
    </CricketContext.Provider>
  );
}

// Custom hook to use context
export function useCricket() {
  const context = useContext(CricketContext);
  if (!context) {
    throw new Error('useCricket must be used within a CricketProvider');
  }
  return context;
}

// Components using context
function PlayerList() {
  const { state, dispatch } = useCricket();

  const addPlayer = () => {
    const newPlayer: CricketPlayer = {
      id: Date.now().toString(),
      name: `Player ${state.players.length + 1}`,
      runs: Math.floor(Math.random() * 1000),
      average: Math.floor(Math.random() * 50)
    };
    dispatch({ type: 'ADD_PLAYER', payload: newPlayer });
  };

  const removePlayer = (id: string) => {
    dispatch({ type: 'REMOVE_PLAYER', payload: id });
  };

  return (
    <div>
      <h3>Players ({state.players.length})</h3>
      <button onClick={addPlayer}>Add Player</button>

      {state.players.map(player => (
        <div key={player.id} style={{ display: 'flex', gap: '10px', margin: '5px 0' }}>
          <span>{player.name} - {player.runs} runs</span>
          <button onClick={() => removePlayer(player.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}

function MatchScoreboard() {
  const { state, dispatch } = useCricket();

  const addRuns = (runs: number) => {
    dispatch({ type: 'UPDATE_SCORE', payload: runs });
  };

  const addWicket = () => {
    dispatch({ type: 'ADD_WICKET' });
  };

  const resetMatch = () => {
    dispatch({ type: 'RESET_MATCH' });
  };

  return (
    <div>
      <h3>Match Scoreboard</h3>
      <p>Score: {state.currentMatch.score}/{state.currentMatch.wickets}</p>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => addRuns(1)}>1 Run</button>
        <button onClick={() => addRuns(4)}>4 Runs</button>
        <button onClick={() => addRuns(6)}>6 Runs</button>
        <button onClick={addWicket}>Wicket</button>
        <button onClick={resetMatch}>Reset</button>
      </div>
    </div>
  );
}

// Main app component
function CricketApp() {
  return (
    <CricketProvider>
      <div style={{ padding: '20px' }}>
        <h1>Cricket Management System</h1>
        <PlayerList />
        <MatchScoreboard />
      </div>
    </CricketProvider>
  );
}

// Context with async operations
export function useCricketAsync() {
  const { state, dispatch } = useCricket();

  const fetchPlayers = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await fetch('/api/players');
      const players = await response.json();

      players.forEach((player: CricketPlayer) => {
        dispatch({ type: 'ADD_PLAYER', payload: player });
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch players' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return {
    ...state,
    fetchPlayers
  };
}
```

### **React Performance & Optimization**

#### Q11: "How do you optimize React performance? Explain memoization techniques."

**Answer:**

```typescript
import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';

// React.memo for component memoization
interface PlayerCardProps {
  player: {
    id: string;
    name: string;
    runs: number;
    average: number;
  };
  onSelect: (id: string) => void;
}

const PlayerCard = memo<PlayerCardProps>(({ player, onSelect }) => {
  console.log(`Rendering PlayerCard for ${player.name}`);

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '10px',
        margin: '5px',
        cursor: 'pointer'
      }}
      onClick={() => onSelect(player.id)}
    >
      <h4>{player.name}</h4>
      <p>Runs: {player.runs}</p>
      <p>Average: {player.average}</p>
    </div>
  );
});

// Custom comparison function for React.memo
const PlayerCardWithCustomComparison = memo<PlayerCardProps>(
  ({ player, onSelect }) => {
    return (
      <div onClick={() => onSelect(player.id)}>
        <h4>{player.name}</h4>
        <p>Runs: {player.runs}</p>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if name or runs change
    return (
      prevProps.player.name === nextProps.player.name &&
      prevProps.player.runs === nextProps.player.runs
    );
  }
);

// useMemo for expensive calculations
function PlayerStatistics({ players }: { players: any[] }) {
  const [filter, setFilter] = useState('');

  // Memoized expensive calculation
  const statistics = useMemo(() => {
    console.log('Calculating statistics...');

    const totalRuns = players.reduce((sum, player) => sum + player.runs, 0);
    const averageRuns = players.length > 0 ? totalRuns / players.length : 0;
    const topScorer = players.reduce((top, current) =>
      current.runs > top.runs ? current : top,
      { runs: 0, name: 'None' }
    );

    return {
      totalRuns,
      averageRuns: Math.round(averageRuns),
      topScorer: topScorer.name,
      playerCount: players.length
    };
  }, [players]); // Only recalculate when players change

  // Memoized filtered players
  const filteredPlayers = useMemo(() => {
    return players.filter(player =>
      player.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [players, filter]);

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter players..."
      />

      <div>
        <h3>Statistics</h3>
        <p>Total Runs: {statistics.totalRuns}</p>
        <p>Average Runs: {statistics.averageRuns}</p>
        <p>Top Scorer: {statistics.topScorer}</p>
        <p>Players: {statistics.playerCount}</p>
      </div>

      <div>
        <h3>Filtered Players ({filteredPlayers.length})</h3>
        {filteredPlayers.map(player => (
          <div key={player.id}>{player.name}</div>
        ))}
      </div>
    </div>
  );
}

// useCallback for function memoization
function PlayerManager() {
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  // Memoized callback to prevent unnecessary re-renders
  const handlePlayerSelect = useCallback((playerId: string) => {
    setSelectedPlayer(playerId);
  }, []);

  // Memoized callback for adding players
  const addPlayer = useCallback(() => {
    const newPlayer = {
      id: Date.now().toString(),
      name: `Player ${players.length + 1}`,
      runs: Math.floor(Math.random() * 1000),
      average: Math.floor(Math.random() * 50)
    };
    setPlayers(prev => [...prev, newPlayer]);
  }, [players.length]);

  // Memoized callback for removing players
  const removePlayer = useCallback((playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  }, []);

  return (
    <div>
      <button onClick={addPlayer}>Add Player</button>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {players.map(player => (
          <PlayerCard
            key={player.id}
            player={player}
            onSelect={handlePlayerSelect}
          />
        ))}
      </div>

      {selectedPlayer && (
        <div>
          <h3>Selected Player: {selectedPlayer}</h3>
          <button onClick={() => removePlayer(selectedPlayer)}>
            Remove Player
          </button>
        </div>
      )}
    </div>
  );
}

// Virtual scrolling for large lists
function VirtualizedPlayerList({ players }: { players: any[] }) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(400);
  const itemHeight = 60;

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      players.length
    );

    return players.slice(startIndex, endIndex).map((player, index) => ({
      ...player,
      index: startIndex + index
    }));
  }, [players, scrollTop, containerHeight]);

  const totalHeight = players.length * itemHeight;

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(player => (
          <div
            key={player.id}
            style={{
              position: 'absolute',
              top: player.index * itemHeight,
              height: itemHeight,
              width: '100%',
              border: '1px solid #ccc',
              padding: '10px'
            }}
          >
            {player.name} - {player.runs} runs
          </div>
        ))}
      </div>
    </div>
  );
}

// Lazy loading components
const LazyPlayerDetails = React.lazy(() => import('./PlayerDetails'));

function App() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div>
      <button onClick={() => setShowDetails(!showDetails)}>
        Toggle Player Details
      </button>

      {showDetails && (
        <React.Suspense fallback={<div>Loading player details...</div>}>
          <LazyPlayerDetails />
        </React.Suspense>
      )}
    </div>
  );
}
```

#### Q12: "Explain React testing with Jest and React Testing Library."

**Answer:**

```typescript
// cricket-player.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CricketProvider, useCricket } from './cricket-context';

// Test component
function TestComponent() {
  const { state, dispatch } = useCricket();

  const addPlayer = () => {
    dispatch({
      type: 'ADD_PLAYER',
      payload: {
        id: '1',
        name: 'Test Player',
        runs: 100,
        average: 50
      }
    });
  };

  return (
    <div>
      <button onClick={addPlayer}>Add Player</button>
      <div data-testid="player-count">{state.players.length}</div>
      {state.players.map(player => (
        <div key={player.id} data-testid={`player-${player.id}`}>
          {player.name}
        </div>
      ))}
    </div>
  );
}

// Test wrapper
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <CricketProvider>{children}</CricketProvider>;
}

describe('Cricket Context', () => {
  test('should add a player when button is clicked', async () => {
    render(<TestComponent />, { wrapper: TestWrapper });

    const addButton = screen.getByText('Add Player');
    const playerCount = screen.getByTestId('player-count');

    expect(playerCount).toHaveTextContent('0');

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(playerCount).toHaveTextContent('1');
    });

    expect(screen.getByTestId('player-1')).toHaveTextContent('Test Player');
  });

  test('should handle user interactions', async () => {
    const user = userEvent.setup();
    render(<TestComponent />, { wrapper: TestWrapper });

    const addButton = screen.getByText('Add Player');

    await user.click(addButton);

    expect(screen.getByTestId('player-1')).toBeInTheDocument();
  });
});

// Mock API testing
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/players', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: '1', name: 'Virat Kohli', runs: 12000, average: 60 },
        { id: '2', name: 'Sachin Tendulkar', runs: 15000, average: 55 }
      ])
    );
  }),

  rest.post('/api/players', (req, res, ctx) => {
    return res(
      ctx.json({ id: '3', name: 'New Player', runs: 0, average: 0 })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Component with API calls
function PlayerListWithAPI() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/players');
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Failed to fetch players:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {players.map(player => (
        <div key={player.id}>{player.name}</div>
      ))}
    </div>
  );
}

describe('PlayerListWithAPI', () => {
  test('should fetch and display players', async () => {
    render(<PlayerListWithAPI />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Virat Kohli')).toBeInTheDocument();
      expect(screen.getByText('Sachin Tendulkar')).toBeInTheDocument();
    });
  });

  test('should handle API errors', async () => {
    server.use(
      rest.get('/api/players', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<PlayerListWithAPI />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });
});

// Custom hook testing
import { renderHook, act } from '@testing-library/react';

function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);

  return { count, increment, decrement };
}

describe('useCounter', () => {
  test('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  test('should initialize with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  test('should increment count', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  test('should decrement count', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });
});

// Integration testing
describe('Cricket App Integration', () => {
  test('should complete full user flow', async () => {
    const user = userEvent.setup();

    render(
      <CricketProvider>
        <PlayerManager />
        <MatchScoreboard />
      </CricketProvider>
    );

    // Add a player
    const addButton = screen.getByText('Add Player');
    await user.click(addButton);

    // Verify player was added
    expect(screen.getByText('Player 1')).toBeInTheDocument();

    // Add runs to match
    const fourRunsButton = screen.getByText('4 Runs');
    await user.click(fourRunsButton);

    // Verify score updated
    expect(screen.getByText('Score: 4/0')).toBeInTheDocument();
  });
});
```

---

## 🎯 Key Takeaways for Interview

### **Codebase Discussion Tips:**

1. **Emphasize SOLID principles** and clean architecture
2. **Highlight performance optimizations** (O(1) lookups, efficient algorithms)
3. **Discuss testing strategy** and code quality measures
4. **Show innovation** (voice commentary, web interface, strategy pattern, cricket realism validation)
5. **Explain decision-making process** for architectural choices
6. **Demonstrate user experience focus** (fun error messages, educational features)
7. **Highlight cricket domain knowledge** (realistic combinations, physics validation)

### **DSA Interview Tips:**

1. **Start with brute force**, then optimize
2. **Discuss time/space complexity** for each solution
3. **Consider edge cases** and error handling
4. **Use appropriate data structures** for the problem
5. **Explain your thought process** clearly

### **Common Follow-up Questions:**

- "How would you handle concurrent users?"
- "What if the rules change frequently?"
- "How would you scale this to millions of matches?"
- "What testing strategies would you use?"
- "How would you optimize for mobile devices?"
- "How did you ensure cricket realism in your validation system?"
- "What makes your error messages both informative and entertaining?"
- "How would you extend the unrealistic combinations list?"

Good luck with your interview! 🚀
