
# Multi-stage build for optimized production image

# Stage 1: Build environment
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Add curl for potential debugging
RUN apk add --no-cache curl

# Copy package files for dependency caching
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci && npm cache clean --force

# Copy all source code
COPY . .

# Build the application (client and server)
RUN npm run build

# Verify build outputs exist
RUN ls -la dist/ && ls -la dist/public/

# Stage 2: Production runtime
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Add curl for health checks
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001

# Copy built application from build stage
COPY --from=build /app/dist ./dist

# Copy other necessary files (public assets, uploads dir if needed)
COPY --from=build /app/public ./public

# Change ownership of the app directory
RUN chown -R appuser:nodejs /app

# Switch to non-root user
USER appuser

# Expose the application port
EXPOSE 3100

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3100/health || exit 1

# Set production environment
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
