import "dotenv/config";
import { defineConfig } from "prisma/config";

// CI環境用のフォールバック
const databaseUrl =
  process.env.DIRECT_URL || "postgresql://user:pass@localhost:5432/db";

export default defineConfig({
  schema: "prisma/schema.prisma",

  datasource: {
    url: databaseUrl,
  },

  migrations: {
    path: "prisma/migrations",
  },
});
