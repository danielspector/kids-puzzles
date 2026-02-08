import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const PUZZLES = [
  {
    slug: "sky-color",
    title: "Why The Sky Is Blue",
    type: "text",
    difficulty: 1,
    points: 10,
    prompt:
      "In one word: what kind of scattering makes a clear daytime sky look blue?",
    hint: "It's named after a scientist; it starts with R.",
    solution: "rayleigh",
  },
  {
    slug: "two-plus-three",
    title: "Powers",
    type: "number",
    difficulty: 2,
    points: 15,
    prompt: "Compute: 2^5 + 3^4 = ?",
    hint: "Work each power first: 2^5 = 32 and 3^4 = 81.",
    solution: "113",
  },
  {
    slug: "bigger-number",
    title: "Which Is Larger?",
    type: "text",
    difficulty: 3,
    points: 15,
    prompt:
      "Which is larger: 7/8 or 0.86? (type exactly: 7/8 or 0.86)",
    hint: "Convert 7/8 to a decimal: 1/8 = 0.125.",
    solution: "7/8",
  },
  {
    slug: "unscramble-cat",
    title: "Harder Scramble",
    type: "text",
    difficulty: 4,
    points: 20,
    prompt: "Unscramble this word: RTAEHC",
    hint: "It's a person you have at school.",
    solution: "teacher",
  },
  {
    slug: "pattern-even",
    title: "Pattern Spotting",
    type: "number",
    difficulty: 5,
    points: 25,
    prompt: "Fill in the blank: 1, 1, 2, 6, 24, __",
    hint: "Each term multiplies by the next counting number (factorials).",
    solution: "120",
  },
  {
    slug: "reverse-ton",
    title: "Backwards (Trick Word)",
    type: "text",
    difficulty: 6,
    points: 25,
    prompt: "Write this word backwards: STRESSED",
    hint: "When you reverse it, it becomes something sweet.",
    solution: "desserts",
  },
  {
    slug: "cookies-left",
    title: "Story Math (Two Steps)",
    type: "number",
    difficulty: 7,
    points: 30,
    prompt:
      "You have 3 boxes. Each box has 12 cookies. You eat 5 and give away 7. How many cookies are left?",
    hint: "Start with total cookies, then subtract 5 and subtract 7.",
    solution: "24",
  },
  {
    slug: "riddle-piano",
    title: "Riddle",
    type: "text",
    difficulty: 8,
    points: 35,
    prompt:
      "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    hint: "You can hear it in a canyon after you shout.",
    solution: "echo",
  },
  {
    slug: "seven-times-eight",
    title: "Multiplication",
    type: "number",
    difficulty: 9,
    points: 40,
    prompt: "Compute: 17 x 19 = ?",
    hint: "Try (18-1)(18+1) = 18^2 - 1.",
    solution: "323",
  },
  {
    slug: "triangle-sides",
    title: "Triangle Angles",
    type: "number",
    difficulty: 10,
    points: 45,
    prompt: "A triangle has angles 40, 65, and x degrees. What is x?",
    hint: "Triangle angles add to 180.",
    solution: "75",
  },
  {
    slug: "word-ladder",
    title: "Letters To Numbers",
    type: "number",
    difficulty: 11,
    points: 50,
    prompt:
      "If A=1, B=2, ..., Z=26: what is C + A + T?",
    hint: "C=3, A=1, T=20.",
    solution: "24",
  },
  {
    slug: "logic-birds",
    title: "Legs Logic",
    type: "number",
    difficulty: 12,
    points: 60,
    prompt:
      "A farm has 20 animals total (only chickens and cows). There are 56 legs total. How many cows are there?",
    hint: "Let cows=c and chickens=20-c. Legs: 4c + 2(20-c) = 56.",
    solution: "8",
  },
] as const;

async function main() {
  for (const p of PUZZLES) {
    await prisma.puzzle.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        prompt: p.prompt,
        hint: p.hint,
        type: p.type,
        difficulty: p.difficulty,
        points: p.points,
        solution: p.solution,
      },
      create: p,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
