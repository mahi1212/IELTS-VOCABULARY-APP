-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "emailVerified" DATETIME,
    "verificationToken" TEXT,
    "googleId" TEXT,
    "image" TEXT,
    "vocabularyProgress" JSONB,
    "quizResults" JSONB,
    "settings" JSONB
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "password", "quizResults", "settings", "updatedAt", "vocabularyProgress") SELECT "createdAt", "email", "id", "name", "password", "quizResults", "settings", "updatedAt", "vocabularyProgress" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
