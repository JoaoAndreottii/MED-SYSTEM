FROM node:20-alpine

WORKDIR /app

# Copy root package files
COPY package.json ./

# Copy API directory
COPY apps/api ./apps/api

# Install dependencies
RUN npm install --legacy-peer-deps

# Generate Prisma
RUN npx prisma generate --schema=/app/apps/api/prisma/schema.prisma

# Build API
WORKDIR /app/apps/api
RUN npx tsc

EXPOSE 3000
ENV NODE_ENV=production

WORKDIR /app/apps/api
CMD ["node", "dist/server.js"]
