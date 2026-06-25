FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api ./apps/api
COPY prisma ./prisma

RUN npm install --legacy-peer-deps
RUN npm -w @med-system/api run build

FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api ./apps/api
COPY prisma ./prisma

RUN npm install --legacy-peer-deps --omit=dev

COPY --from=builder /app/apps/api/dist ./apps/api/dist

EXPOSE 3000

CMD ["node", "/app/apps/api/dist/server.js"]
