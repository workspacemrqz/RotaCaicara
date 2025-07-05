import { db } from "./db";
import { categories, businesses, siteSettings } from "@shared/schema";

export async function initializeDatabase() {
  try {
    console.log("Initializing database...");

    // Test database connection with retry mechanism
    let retries = 3;
    let connected = false;

    while (retries > 0 && !connected) {
      try {
        await db.select().from(categories).limit(1);
        connected = true;
        console.log("Database connection successful");
      } catch (error) {
        retries--;
        console.log(`Database connection attempt failed. Retries remaining: ${retries}`);
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return true;
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}