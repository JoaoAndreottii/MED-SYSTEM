FROM node:20-alpine

WORKDIR /app/apps/api

# Copy only API files
COPY apps/api/package.json ./
COPY apps/api/src ./src
COPY apps/api/tsconfig.json ./
COPY apps/api/prisma ./prisma

# Install dependencies
RUN npm install --legacy-peer-deps

# Build
RUN npx tsc

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
