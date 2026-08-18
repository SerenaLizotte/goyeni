import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  host: "dpg-da105mugekts73fvavl0-a.oregon-postgres.render.com",
  port: 5432,
  user: "goyenni_user",
  password: process.env.DB_PASSWORD,
  database: "goyenni",
  ssl: { rejectUnauthorized: false },
});

export const prisma = new PrismaClient({ adapter });
