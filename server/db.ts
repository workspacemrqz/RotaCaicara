import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not configured. Please add it to Secrets:");
  console.error("Key: DATABASE_URL");
  console.error("Value: postgresql://user:password@hostname:port/database");
  console.error("Using fallback configuration for development...");
  
  // Fallback for development - you'll need to add DATABASE_URL to Secrets
  process.env.DATABASE_URL = "postgresql://localhost:5432/fallback_db";
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 10,
});

export const db = drizzle(pool, { schema });