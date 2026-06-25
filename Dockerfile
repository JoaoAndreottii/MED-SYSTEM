FROM node:20-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN npm install --legacy-peer-deps

# Build API
RUN npm -w @med-system/api run build

# Remove dev dependencies
RUN npm prune --omit=dev

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "apps/api/dist/server.js"]
