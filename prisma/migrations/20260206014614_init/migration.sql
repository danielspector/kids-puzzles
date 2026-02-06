-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Puzzle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "solution" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserPuzzle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "puzzleId" TEXT NOT NULL,
    "attemptsCount" INTEGER NOT NULL DEFAULT 0,
    "completedAt" DATETIME,
    "lastAttemptAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserPuzzle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserPuzzle_puzzleId_fkey" FOREIGN KEY ("puzzleId") REFERENCES "Puzzle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Puzzle_slug_key" ON "Puzzle"("slug");

-- CreateIndex
CREATE INDEX "Puzzle_difficulty_idx" ON "Puzzle"("difficulty");

-- CreateIndex
CREATE INDEX "UserPuzzle_userId_completedAt_idx" ON "UserPuzzle"("userId", "completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserPuzzle_userId_puzzleId_key" ON "UserPuzzle"("userId", "puzzleId");
