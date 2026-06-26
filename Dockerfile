FROM node:20-alpine

WORKDIR /app/apps/api

COPY apps/api/package.json ./
COPY apps/api/src/server.js ./

RUN npm install express

EXPOSE 3000

CMD ["node", "server.js"]
