FROM node:20-alpine

WORKDIR /app

COPY web-server.js .
COPY web-index.html .

EXPOSE 3000

ENV NEXT_PUBLIC_API_URL=https://med-systemapi-production.up.railway.app

CMD ["node", "web-server.js"]
