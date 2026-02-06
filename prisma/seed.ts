import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const PUZZLES = [
  {
    slug: "sky-color",
    title: "A Super Easy Start",
    type: "text",
    difficulty: 1,
    points: 5,
    prompt: "On a clear day, what color is the sky?",
    solution: "blue",
  },
  {
    slug: "two-plus-three",
    title: "Tiny Math",
    type: "number",
    difficulty: 2,
    points: 5,
    prompt: "2 + 3 = ?",
    solution: "5",
  },
  {
    slug: "bigger-number",
    title: "Which Is Bigger?",
    type: "number",
    difficulty: 3,
    points: 5,
    prompt: "Which is bigger: 9 or 6? (type the bigger number)",
    solution: "9",
  },
  {
    slug: "unscramble-cat",
    title: "Word Scramble",
    type: "text",
    difficulty: 4,
    points: 10,
    prompt: "Unscramble this word: TAC",
    solution: "cat",
  },
  {
    slug: "pattern-even",
    title: "Number Pattern",
    type: "number",
    difficulty: 5,
    points: 10,
    prompt: "Fill in the blank: 2, 4, 6, __",
    solution: "8",
  },
  {
    slug: "reverse-ton",
    title: "Backwards",
    type: "text",
    difficulty: 6,
    points: 10,
    prompt: "Write this word backwards: TON",
    solution: "not",
  },
  {
    slug: "cookies-left",
    title: "Story Math",
    type: "number",
    difficulty: 7,
    points: 15,
    prompt: "You have 10 cookies. You give away 4. How many are left?",
    solution: "6",
  },
  {
    slug: "riddle-piano",
    title: "Riddle Time",
    type: "text",
    difficulty: 8,
    points: 20,
    prompt:
      "I have keys but no locks. I have space but no room. You can enter but can't go outside. What am I?",
    solution: "keyboard",
  },
  {
    slug: "seven-times-eight",
    title: "Bigger Math",
    type: "number",
    difficulty: 9,
    points: 25,
    prompt: "7 x 8 = ?",
    solution: "56",
  },
  {
    slug: "triangle-sides",
    title: "Quick Thinking",
    type: "number",
    difficulty: 10,
    points: 25,
    prompt: "How many sides does a triangle have?",
    solution: "3",
  },
  {
    slug: "word-ladder",
    title: "One Letter Change",
    type: "text",
    difficulty: 11,
    points: 30,
    prompt:
      "Change ONE letter in the word 'COLD' to make something you hold. (type the new word)",
    solution: "hold",
  },
  {
    slug: "logic-birds",
    title: "A Little Logic",
    type: "number",
    difficulty: 12,
    points: 35,
    prompt:
      "Three birds sit on a fence. Two fly away. How many birds are still on the fence?",
    solution: "1",
  },
] as const;

async function main() {
  for (const p of PUZZLES) {
    await prisma.puzzle.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        prompt: p.prompt,
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
