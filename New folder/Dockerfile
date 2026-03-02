# Frontend Dockerfile
# Multi-stage build for React application

# -------------------------
# Stage 1: Build
# -------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source code
COPY . .

# Build the React app for production
RUN npm run build

# -------------------------
# Stage 2: Production
# -------------------------
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install serve globally to serve the static files
RUN npm install -g serve

# Copy the production build from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Optional health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start the application using serve
CMD ["serve", "-s", "dist", "-l", "3000"]
