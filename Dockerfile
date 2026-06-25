FROM node:20-alpine AS builder

WORKDIR /app/apps/api

# Copy only API files
COPY apps/api/package.json apps/api/package-lock.json ./
COPY apps/api/src ./src
COPY apps/api/tsconfig.json ./
COPY apps/api/prisma ./prisma

# Install dependencies
RUN npm install --legacy-peer-deps

# Build with TypeScript
RUN npx tsc

FROM node:20-alpine

WORKDIR /app/apps/api

# Copy package files
COPY apps/api/package.json apps/api/package-lock.json ./

# Install only production dependencies
RUN npm install --legacy-peer-deps --omit=dev

# Copy built code from builder
COPY --from=builder /app/apps/api/dist ./dist

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
