export type ProblemSource = "LeetCode" | "Codeforces" | "Advent of Code";

export type PairingProblem = {
  slug: string;
  title: string;
  source: ProblemSource;
  difficulty: "Easy" | "Medium" | "Hard" | "Event";
  summary: string;
  url: string;
  tags: string[];
  pairingPrompt: string;
  statement?: {
    description: string;
    constraints: string[];
    examples: Array<{ input: string; output: string; explanation?: string }>;
  };
  kind?: "problem" | "calendar" | "season";
};

/**
 * A deliberately small, stable starter catalogue. It keeps the pairing loop
 * useful without scraping third-party problem sites or claiming contest dates
 * that can change underneath us.
 */
export const pairingProblems: PairingProblem[] = [
  {
    slug: "two-sum",
    title: "Two Sum",
    source: "LeetCode",
    difficulty: "Easy",
    summary: "A clean warm-up for hashing, trade-offs, and explaining an approach out loud.",
    url: "https://leetcode.com/problems/two-sum/",
    tags: ["Arrays", "Hash Map"],
    pairingPrompt: "Compare the brute-force and hash-map paths, then write down the invariant before coding.",
    statement: {
      description: "Given an array of integers nums and an integer target, return the indices of the two numbers whose sum is target. You may assume exactly one solution exists, and you may not use the same element twice.",
      constraints: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i], target ≤ 10⁹", "Exactly one valid answer exists."],
      examples: [{ input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "nums[0] + nums[1] equals 9." }],
    },
  },
  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    source: "LeetCode",
    difficulty: "Easy",
    summary: "Practice stack reasoning and edge-case communication in a short shared session.",
    url: "https://leetcode.com/problems/valid-parentheses/",
    tags: ["Stack", "Strings"],
    pairingPrompt: "Agree on the stack invariant and test the smallest failing strings together.",
    statement: {
      description: "Given a string containing only parentheses, brackets, and braces, determine whether every opening character is closed by the same type in the correct order.",
      constraints: ["1 ≤ s.length ≤ 10⁴", "s contains only ()[]{}."],
      examples: [{ input: 's = "()[]{}"', output: "true" }, { input: 's = "(]"', output: "false", explanation: "A closing bracket must match the most recent opening bracket." }],
    },
  },
  {
    slug: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    source: "LeetCode",
    difficulty: "Medium",
    summary: "A great two-pointer problem for narrating window invariants and complexity.",
    url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    tags: ["Sliding Window", "Hash Map"],
    pairingPrompt: "Name what the window guarantees before moving either pointer.",
    statement: {
      description: "Given a string s, return the length of the longest substring that contains no repeated characters.",
      constraints: ["0 ≤ s.length ≤ 5 × 10⁴", "s may contain letters, digits, symbols, and spaces."],
      examples: [{ input: 's = "abcabcbb"', output: "3", explanation: '"abc" is the longest substring without repeats.' }],
    },
  },
  {
    slug: "merge-intervals",
    title: "Merge Intervals",
    source: "LeetCode",
    difficulty: "Medium",
    summary: "Sort, scan, and make the interval boundaries explicit as a team.",
    url: "https://leetcode.com/problems/merge-intervals/",
    tags: ["Intervals", "Sorting"],
    pairingPrompt: "Sketch two overlapping cases and agree on which interval owns the boundary.",
    statement: {
      description: "Given intervals where intervals[i] = [startᵢ, endᵢ], merge every overlapping interval and return the non-overlapping result.",
      constraints: ["1 ≤ intervals.length ≤ 10⁴", "0 ≤ startᵢ ≤ endᵢ ≤ 10⁴"],
      examples: [{ input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "[1,3] and [2,6] overlap." }],
    },
  },
  {
    slug: "number-of-islands",
    title: "Number of Islands",
    source: "LeetCode",
    difficulty: "Medium",
    summary: "Pair on graph traversal choices, mutation, and a crisp DFS/BFS explanation.",
    url: "https://leetcode.com/problems/number-of-islands/",
    tags: ["Graphs", "DFS", "BFS"],
    pairingPrompt: "Pick traversal together, then decide whether marking belongs on discovery or visit.",
    statement: {
      description: "Given a grid of '1' land and '0' water, return the number of islands. An island is connected horizontally or vertically, not diagonally.",
      constraints: ["1 ≤ grid.length, grid[i].length ≤ 300", "Each grid cell is '0' or '1'."],
      examples: [{ input: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]', output: "2" }],
    },
  },
  {
    slug: "lru-cache",
    title: "LRU Cache",
    source: "LeetCode",
    difficulty: "Medium",
    summary: "A classic collaboration problem: data-structure design, APIs, and invariants.",
    url: "https://leetcode.com/problems/lru-cache/",
    tags: ["Design", "Hash Map", "Linked List"],
    pairingPrompt: "Draw the hash map and list first; every operation should preserve both structures.",
    statement: {
      description: "Design an LRU cache with get(key) and put(key, value). Both operations must run in O(1) average time, and inserting past capacity evicts the least recently used key.",
      constraints: ["1 ≤ capacity ≤ 3000", "0 ≤ key, value ≤ 10⁴", "At most 2 × 10⁵ operations."],
      examples: [{ input: "LRUCache(2); put(1,1); put(2,2); get(1); put(3,3); get(2)", output: "1, then -1", explanation: "Key 2 is evicted after key 1 becomes recently used." }],
    },
  },
  {
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    source: "LeetCode",
    difficulty: "Hard",
    summary: "A satisfying whiteboard problem for comparing pre-computation and two-pointer reasoning.",
    url: "https://leetcode.com/problems/trapping-rain-water/",
    tags: ["Two Pointers", "Dynamic Programming"],
    pairingPrompt: "Explain why the shorter boundary is safe to commit before writing the loop.",
    statement: {
      description: "Given n non-negative integers representing an elevation map, compute how much water it can trap after rain.",
      constraints: ["1 ≤ height.length ≤ 2 × 10⁴", "0 ≤ height[i] ≤ 10⁵"],
      examples: [{ input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }],
    },
  },
  {
    slug: "codeforces-contest-calendar",
    title: "Codeforces contest calendar",
    source: "Codeforces",
    difficulty: "Event",
    summary: "Find the next official contest, assemble a tiny team, and keep the problem set in the call.",
    url: "https://codeforces.com/contests",
    tags: ["Competitive Programming", "Contest"],
    pairingPrompt: "Choose a contest and agree on problem ownership, hints, and when to regroup.",
    kind: "calendar",
  },
  {
    slug: "advent-of-code",
    title: "Advent of Code archive",
    source: "Advent of Code",
    difficulty: "Event",
    summary: "Pick a day from the archive and use the room as a low-pressure seasonal code jam.",
    url: "https://adventofcode.com/",
    tags: ["Puzzles", "Seasonal", "Algorithms"],
    pairingPrompt: "Read the puzzle aloud, split the parsing and solving ideas, then reunite on tests.",
    kind: "season",
  },
];

export function getPairingProblem(slug?: string | null) {
  return pairingProblems.find((problem) => problem.slug === slug);
}
