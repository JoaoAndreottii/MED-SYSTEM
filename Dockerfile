FROM node:20-alpine

WORKDIR /app

COPY api-server.js .

RUN apk add --no-cache npm && npm install express

EXPOSE 3000

CMD ["node", "api-server.js"]
