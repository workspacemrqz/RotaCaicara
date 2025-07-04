module.exports = {
  apps: [{
    name: "rotacaicara",
    script: "node",
    args: "dist/index.js",
    cwd: "/home/rotacaicara.com.br/public_html",
    env: {
      NODE_ENV: "production",
      PORT: "3002",
      SESSION_SECRET: "@Workspacen8n",
      PGUSER: "mrqz",
      PGPASSWORD: "@Workspacen8n",
      DATABASE_URL: "postgresql://mrqz:%40Workspacen8n@31.97.30.149:5432/rotacaicara",
      PGDATABASE: "rotacaicara",
      PGHOST: "31.97.30.149",
      PGPORT: "5432",
      REPL_ID: "rotacaicara",
      ISSUER_URL: "https://replit.com/oidc",
      REPLIT_DOMAINS: "rotacaicara.com.br,www.rotacaicara.com.br"
    }
  }]
};