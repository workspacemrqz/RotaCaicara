
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/rotacaicara';

const migrationClient = postgres(connectionString, {
  max: 1,
  ssl: connectionString.includes('sslmode=disable') ? false : 'require',
});

const db = drizzle(migrationClient);

async function main() {
  console.log('Running migrations...');
  
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
  
  await migrationClient.end();
}

main();
