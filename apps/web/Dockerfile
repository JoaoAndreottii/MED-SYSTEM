FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY apps/web ./apps/web

RUN npm install --legacy-peer-deps

WORKDIR /app/apps/web
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY apps/web/package.json ./apps/web/

RUN npm install --legacy-peer-deps --omit=dev

WORKDIR /app/apps/web
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public

EXPOSE 3000

ENV NEXT_PUBLIC_API_URL=https://med-systemapi-production.up.railway.app

CMD ["npm", "start"]
