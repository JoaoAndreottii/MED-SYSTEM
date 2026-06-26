FROM node:20-alpine

WORKDIR /app

COPY apps/api/package.json ./
COPY apps/api/package-lock.json* ./

RUN npm install express

COPY apps/api/src/server.js ./

EXPOSE 3000

CMD ["node", "server.js"]
