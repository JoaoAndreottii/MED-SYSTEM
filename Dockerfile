FROM node:20-alpine

WORKDIR /app

# Copiar apenas arquivo .js simples
COPY apps/api/src/server.js ./

# Instalar apenas Express
RUN npm install express

EXPOSE 3000

CMD ["node", "server.js"]
