FROM node:20-alpine AS builder

WORKDIR /app

COPY apps/web/package.json ./
RUN npm install --legacy-peer-deps

COPY apps/web ./
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY apps/web/package.json ./
RUN npm install --legacy-peer-deps --omit=dev --production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY apps/web/next.config.js* ./

EXPOSE 3000

ENV NEXT_PUBLIC_API_URL=https://med-systemapi-production.up.railway.app

CMD ["npm", "start"]
