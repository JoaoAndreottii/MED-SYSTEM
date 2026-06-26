FROM node:20-alpine AS builder

WORKDIR /app

# Copy all source
COPY . .

# Install all deps including dev
RUN npm install --legacy-peer-deps

# Generate Prisma & build
WORKDIR /app/apps/api
RUN npx prisma generate && npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY apps/api/package.json ./apps/api/

# Install only production deps
RUN npm install --legacy-peer-deps --omit=dev

# Copy compiled output from builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

EXPOSE 3000
ENV NODE_ENV=production

WORKDIR /app/apps/api
CMD ["node", "dist/server.js"]
