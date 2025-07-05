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
    appType: "custom",
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

      const { render } = await vite.ssrLoadModule("/src/main.tsx");
      const appHtml = await render();
      const html = template.replace(`<!--ssr-outlet-->`, appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  if (vite.ws && vite.ws.handleUpgrade) {
    server.on("upgrade", vite.ws.handleUpgrade);
  }
    // Add error handler to prevent crashes
  server.on('error', (err) => {
    console.error('Server error:', err);
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");
  const clientIndexPath = path.resolve(distPath, "index.html");

  app.use(express.static(distPath));

  app.use("*", (_req, res) => {
    res.sendFile(clientIndexPath);
  });
}