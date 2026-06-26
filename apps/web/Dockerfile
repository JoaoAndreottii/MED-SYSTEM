FROM node:20-alpine AS builder

WORKDIR /app

COPY apps/web/package.json ./
COPY apps/web/package-lock.json* ./

RUN npm install --legacy-peer-deps

COPY apps/web ./

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY apps/web/package.json ./
COPY apps/web/package-lock.json* ./

RUN npm install --legacy-peer-deps --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

ENV NEXT_PUBLIC_API_URL=https://med-systemapi-production.up.railway.app
ENV NODE_ENV=production

CMD ["npm", "start"]
