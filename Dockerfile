FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install --legacy-peer-deps

RUN npm run build

RUN npm prune --omit=dev

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "apps/api/dist/server.js"]
