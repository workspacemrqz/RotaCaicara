import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Body parsing middleware must be first
app.use(express.json());

// CORS middleware after body parsing
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.urlencoded({ extended: false }));

// Health check endpoint for EasyPanel
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Serve static files from public directory (for favicon, etc.)
app.use(express.static('public'));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Check environment from NODE_ENV
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    try {
      const { configureVite } = await import("./vite");
      await configureVite(app);
    } catch (error) {
      console.log("Vite configuration skipped in production:", error instanceof Error ? error.message : 'Unknown error');
    }
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "3100");

  server.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`📡 Accepting connections from all interfaces (0.0.0.0:${port})`);
    console.log(`🔗 Health check available at: http://localhost:${port}/health`);
  });
})();