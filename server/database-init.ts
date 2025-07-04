
import { db, pool } from './db';
import { sql } from 'drizzle-orm';

export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Test connection
    await db.execute(sql`SELECT 1`);
    console.log('Database connection successful');
    
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}
