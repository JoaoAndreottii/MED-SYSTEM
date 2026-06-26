FROM node:20-alpine

WORKDIR /app

# Minimal setup - just Express
RUN npm init -y && npm install express

COPY apps/api/src/server.js .

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "server.js"]
