FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and apps structure
COPY package.json package-lock.json tsconfig.json ./
COPY apps/api ./apps/api
COPY prisma ./prisma

# Install dependencies
RUN npm install --legacy-peer-deps

# Build API
WORKDIR /app/apps/api
RUN npx tsc

FROM node:20-alpine

WORKDIR /app

# Copy only runtime files
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY prisma ./prisma

# Install production dependencies
WORKDIR /app
RUN npm install --legacy-peer-deps --omit=dev

# Copy built code
COPY --from=builder /app/apps/api/dist ./apps/api/dist

EXPOSE 3000

CMD ["node", "/app/apps/api/dist/server.js"]
