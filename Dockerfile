# Etapa de build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Instala o tsx para rodar TS diretamente
RUN npm install -g tsx

EXPOSE 3000

# No CMD, garantimos que as migrations rodam após o carregamento das envs
CMD ["sh", "-c", "npm run db:migrate && tsx src/server.ts"]
