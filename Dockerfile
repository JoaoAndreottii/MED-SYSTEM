FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files (for type definitions if needed)
COPY package.json package-lock.json ./

# Copy API code
COPY apps/api ./apps/api

# Install all dependencies
RUN npm install --legacy-peer-deps

# Build TypeScript
WORKDIR /app
RUN cd apps/api && npx tsc

FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY apps/api/package.json ./apps/api/package.json

# Copy built dist
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Copy Prisma and node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules

EXPOSE 3000

ENV NODE_ENV=production

WORKDIR /app/apps/api

CMD ["node", "dist/server.js"]
