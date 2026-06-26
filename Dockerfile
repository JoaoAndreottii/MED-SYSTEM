FROM node:20-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install all dependencies
RUN npm install --legacy-peer-deps

# Generate Prisma client BEFORE build
RUN npx prisma generate

# Build directly with tsc
WORKDIR /app/apps/api
RUN npx tsc

# Verify build worked
RUN test -f dist/server.js || (echo "Build failed!" && exit 1)

# Remove dev deps
WORKDIR /app
RUN npm prune --omit=dev

EXPOSE 3000
ENV NODE_ENV=production

WORKDIR /app/apps/api
CMD ["node", "dist/server.js"]
