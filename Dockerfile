
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with dev dependencies
RUN npm ci --include=dev

# Copy source code
COPY . .

# Build the application
RUN npm run build:simple

# Remove dev dependencies for production
RUN npm ci --only=production && npm cache clean --force

# Expose port
EXPOSE 3100

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3100/health || exit 1

# Start the application
CMD ["npm", "start"]
