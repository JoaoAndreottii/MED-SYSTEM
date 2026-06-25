FROM node:20-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install all dependencies
RUN npm install --legacy-peer-deps 2>&1 | tail -20

# Build directly with tsc (no npm script)
WORKDIR /app/apps/api
RUN npx tsc 2>&1 | tail -20

# Verify build worked
RUN test -f dist/server.js || (echo "Build failed!" && exit 1)

# Remove dev deps
WORKDIR /app
RUN npm prune --omit=dev 2>&1 | tail -10

EXPOSE 3000
ENV NODE_ENV=production

WORKDIR /app/apps/api
CMD ["node", "dist/server.js"]
