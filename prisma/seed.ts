import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PUZZLES = [
  {
    slug: "sky-color",
    title: "Look Up!",
    type: "text",
    difficulty: 1,
    points: 5,
    prompt: "On a clear day, what color is the sky?",
    hint: "It's the same color as many blueberries.",
    solution: "blue",
  },
  {
    slug: "two-plus-three",
    title: "Two-Step Word Problem",
    type: "number",
    difficulty: 2,
    points: 10,
    prompt:
      "You have 18 stickers. You give 5 away, then you get 7 more. How many stickers do you have now?",
    hint: "Do 18 - 5 first, then add 7.",
    solution: "20",
  },
  {
    slug: "bigger-number",
    title: "Which Fraction Is Larger?",
    type: "text",
    difficulty: 3,
    points: 15,
    prompt: "Which is larger: 3/4 or 5/8? (type exactly: 3/4 or 5/8)",
    hint: "Try turning both into eighths.",
    solution: "3/4",
  },
  {
    slug: "unscramble-cat",
    title: "Word Scramble",
    type: "text",
    difficulty: 4,
    points: 20,
    prompt: "Unscramble this word: NGLTRIAE",
    hint: "It's a 3-sided shape.",
    solution: "triangle",
  },
  {
    slug: "pattern-even",
    title: "Number Pattern",
    type: "number",
    difficulty: 5,
    points: 25,
    prompt: "Fill in the blank: 2, 5, 10, 17, 26, __",
    hint: "Look at what you add each time: +3, +5, +7, +9, ...",
    solution: "37",
  },
  {
    slug: "reverse-ton",
    title: "Backwards (Trick Word)",
    type: "text",
    difficulty: 6,
    points: 25,
    prompt: "Write this word backwards: DRAWER",
    hint: "It becomes something you can earn.",
    solution: "reward",
  },
  {
    slug: "cookies-left",
    title: "Time Math",
    type: "number",
    difficulty: 7,
    points: 30,
    prompt:
      "From 3:25 to 5:05 is how many minutes? (type a number)",
    hint: "3:25 -> 4:25 is 60 minutes. Then count from 4:25 to 5:05.",
    solution: "100",
  },
  {
    slug: "riddle-piano",
    title: "Riddle",
    type: "text",
    difficulty: 8,
    points: 35,
    prompt:
      "I have hands but I cannot clap. What am I?",
    hint: "You might hang it on a wall.",
    solution: "clock",
  },
  {
    slug: "seven-times-eight",
    title: "Multiplication",
    type: "number",
    difficulty: 9,
    points: 40,
    prompt: "Compute: 18 x 17 = ?",
    hint: "Try 18 x (10 + 7).",
    solution: "306",
  },
  {
    slug: "triangle-sides",
    title: "Perimeter",
    type: "number",
    difficulty: 10,
    points: 45,
    prompt: "A rectangle is 9 cm by 4 cm. What is its perimeter?",
    hint: "Perimeter is all the way around: add all 4 sides.",
    solution: "26",
  },
  {
    slug: "word-ladder",
    title: "Letters To Numbers",
    type: "number",
    difficulty: 11,
    points: 50,
    prompt:
      "If A=1, B=2, ..., Z=26: what is B + O + Y?",
    hint: "B=2, O=15, Y=25.",
    solution: "42",
  },
  {
    slug: "logic-birds",
    title: "Legs Logic",
    type: "number",
    difficulty: 12,
    points: 60,
    prompt:
      "A farm has 14 animals total (only chickens and rabbits). There are 38 legs total. How many rabbits are there?",
    hint: "Chickens have 2 legs, rabbits have 4. Start by assuming all are chickens.",
    solution: "5",
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
