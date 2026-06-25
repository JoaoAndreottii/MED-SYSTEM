FROM node:20-alpine

WORKDIR /app

# Copy all necessary files
COPY package.json package-lock.json tsconfig.json ./
COPY apps/api ./apps/api
COPY prisma ./prisma

# Install all dependencies
RUN npm install --legacy-peer-deps

# Explicitly generate Prisma client
RUN npx prisma generate

# Build the API
WORKDIR /app/apps/api
RUN npx tsc

# Go back and remove dev dependencies
WORKDIR /app
RUN npm prune --omit=dev

EXPOSE 3000
ENV NODE_ENV=production

WORKDIR /app/apps/api
CMD ["node", "dist/server.js"]
