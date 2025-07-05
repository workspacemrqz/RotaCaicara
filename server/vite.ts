
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
  const distPath = path.resolve(process.cwd(), "dist", "public");
  const clientIndexPath = path.resolve(distPath, "index.html");

  // Verify build directory exists
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}. Make sure to build the client first with 'npm run build'.`
    );
  }

  // Verify index.html exists
  if (!fs.existsSync(clientIndexPath)) {
    throw new Error(
      `Could not find index.html in: ${clientIndexPath}. Make sure the client build completed successfully.`
    );
  }

  console.log(`📁 Serving static files from: ${distPath}`);
  console.log(`📄 SPA fallback file: ${clientIndexPath}`);

  // Serve static files (CSS, JS, images, etc.) with proper caching
  app.use(express.static(distPath, {
    maxAge: process.env.NODE_ENV === "production" ? "1y" : "0",
    etag: true,
    lastModified: true,
    index: false // Disable automatic index.html serving, we'll handle it explicitly
  }));

  // SPA fallback - serve index.html for all non-API routes
  app.get("*", (req, res, next) => {
    // Skip API routes and health check
    if (req.path.startsWith("/api") || req.path === "/health") {
      return next();
    }

    try {
      res.sendFile(clientIndexPath, (err) => {
        if (err) {
          console.error("Error serving index.html:", err);
          res.status(500).json({ 
            error: "Failed to serve application", 
            message: "Internal server error" 
          });
        }
      });
    } catch (error) {
      console.error("Error in SPA fallback:", error);
      res.status(500).json({ 
        error: "Failed to serve application", 
        message: "Internal server error" 
      });
    }
  });
}
