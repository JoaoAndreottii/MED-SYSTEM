FROM node:20-alpine

WORKDIR /app

# Copy ONLY api files and root package
COPY package.json package-lock.json ./
COPY apps/api ./apps/api

# Install root deps
RUN npm install --legacy-peer-deps

# Go to API directory and install its specific deps
WORKDIR /app/apps/api
RUN npm install --legacy-peer-deps

# Build API
RUN npm run build

# Remove node_modules and reinstall production-only
WORKDIR /app
RUN rm -rf node_modules apps/api/node_modules
RUN npm install --legacy-peer-deps --omit=dev
WORKDIR /app/apps/api
RUN npm install --legacy-peer-deps --omit=dev

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/server.js"]
