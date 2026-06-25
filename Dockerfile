FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api ./apps/api

RUN npm install --legacy-peer-deps
RUN npm -w @med-system/api run build

RUN npm install --legacy-peer-deps --omit=dev

EXPOSE 3000

CMD ["node", "/app/apps/api/dist/server.js"]
