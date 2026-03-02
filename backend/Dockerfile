# ================================
# Backend Dockerfile
# Node.js (Render Compatible)
# ================================

FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install build tools (only needed if native modules are used)
RUN apk add --no-cache python3 make g++ bash

# Copy package files first (better Docker cache)
COPY package*.json ./

# Install ONLY production dependencies
RUN npm install --only=production

# Copy backend source code
COPY . .

# Expose default port (Render injects actual PORT)
EXPOSE 3001

# Start backend server
CMD ["node", "server.js"]
