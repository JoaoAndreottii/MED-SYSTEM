FROM node:20-alpine AS builder

WORKDIR /app

COPY . .
RUN npm install --legacy-peer-deps
WORKDIR /app/apps/api
RUN npx prisma generate && npm run build

FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY apps/api/package.json ./apps/api/

RUN npm install --legacy-peer-deps --omit=dev
WORKDIR /app/apps/api
RUN npm install --legacy-peer-deps --omit=dev

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/server.js"]
