import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/rotacaicara";

// Create the connection with specific settings for EasyPanel
const client = postgres(connectionString, {
  ssl: connectionString.includes('sslmode=disable') ? false : 'require',
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create the database instance
export const db = drizzle(client);