# ==========================================
# 🐳 Production Dockerfile for Moulyasree Admin
# Multi-stage: Vite React Build -> NGINX Alpine
# ==========================================

# Step 1: Build Phase
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build Vite React SPA
ARG VITE_API_URL
ARG VITE_BASE_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_BASE_URL=${VITE_BASE_URL}

RUN npm run build

# Step 2: Production Nginx Server
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=builder /app/dist .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
