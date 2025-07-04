import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set, using default development URL");
  process.env.DATABASE_URL = "postgresql://user:password@localhost:5432/database_name";
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });