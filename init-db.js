
import { Pool } from 'pg';

async function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.log("DATABASE_URL not found. Creating local SQLite fallback...");
    return;
  }

  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await pool.query('SELECT 1');
    console.log("Database connection successful!");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

initializeDatabase().catch(console.error);
