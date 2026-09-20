# ==========================================
# 🐳 Production Dockerfile for Moulyasree API
# Optimized for AWS App Runner / ECS Fargate / EKS
# ==========================================

FROM node:20-alpine AS base
WORKDIR /app

# Install build dependencies if needed
RUN apk add --no-cache curl

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy application source code
COPY . .

# Create non-privileged user for AWS security compliance
USER node

# Expose standard API port
EXPOSE 5000

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# AWS Health Check instruction
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start server
CMD ["node", "server.js"]
