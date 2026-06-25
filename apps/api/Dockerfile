# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json* ./

# Copy apps and packages
COPY apps/api ./apps/api
COPY packages ./packages

# Install all dependencies (including dev)
RUN npm ci

# Build and generate Prisma client
RUN npm -w @med-system/api run build
RUN npm -w @med-system/api run prisma:generate

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/
COPY packages ./packages

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built application
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/packages ./packages

WORKDIR /app/apps/api

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Run app
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
