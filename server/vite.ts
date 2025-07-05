import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export const log = (...args: Parameters<typeof console.log>) => {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  console.log(`🔵 [${formattedTime}]`, ...args);
};

export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    configFile: path.resolve(process.cwd(), "vite.config.ts"),
    server: { middlewareMode: true },
    appType: "spa",
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        if (msg.includes("WebSocket server error") || msg.includes("WebSocket connection closed")) {
          return;
        }
        viteLogger.error(msg, options);
      },
    },
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(process.cwd(), "client", "index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = await vite.transformIndexHtml(url, template);

      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export async function configureVite(app: Express) {
  const vite = await createViteServer({
    configFile: path.resolve(process.cwd(), "vite.config.ts"),
    server: { middlewareMode: true },
    appType: "spa",
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        if (msg.includes("WebSocket server error") || msg.includes("WebSocket connection closed")) {
          return;
        }
        viteLogger.error(msg, options);
      },
    },
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(process.cwd(), "client", "index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = await vite.transformIndexHtml(url, template);

      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve("dist/public");
  const indexPath = path.join(distPath, "index.html");

  console.log("📁 Static files configuration:");
  console.log(`   Dist path: ${distPath}`);
  console.log(`   Index path: ${indexPath}`);
  console.log(`   Dist exists: ${fs.existsSync(distPath)}`);
  console.log(`   Index exists: ${fs.existsSync(indexPath)}`);

  if (!fs.existsSync(distPath)) {
    console.error(`❌ Build directory missing: ${distPath}`);
    throw new Error(`Build directory does not exist: ${distPath}. Run 'npm run build' first.`);
  }

  if (!fs.existsSync(indexPath)) {
    console.error(`❌ Index file missing: ${indexPath}`);
    throw new Error(`Index file does not exist: ${indexPath}. Build may be incomplete.`);
  }

  // Serve static files with cache headers for EasyPanel
  app.use(express.static(distPath, { 
    maxAge: "1h",
    etag: true,
    lastModified: true
  }));

  // SPA fallback for all non-API routes
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ message: "API endpoint not found" });
    }

    // Send index.html for all client routes
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error("Error serving index.html:", err);
        res.status(500).send("Internal Server Error");
      }
    });
  });

  console.log("✅ Static file serving configured for EasyPanel");
}