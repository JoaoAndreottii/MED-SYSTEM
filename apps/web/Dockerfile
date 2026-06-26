FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/web ./apps/web

RUN npm install --legacy-peer-deps

RUN npm run -w @med-system/web build

FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps --omit=dev

COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY apps/web/package.json ./apps/web/

EXPOSE 3000

ENV NEXT_PUBLIC_API_URL=https://med-systemapi-production.up.railway.app
ENV NODE_ENV=production

WORKDIR /app/apps/web

CMD ["npm", "start"]
