FROM node:18-slim

# Instalar OpenSSL y los certificados ca-certificates (requerido por Prisma)
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar el package.json y package-lock.json
COPY package*.json ./

# Instalar DEPENDENCIAS (incluyendo prisma)
RUN npm install --omit=dev && npm install prisma @prisma/client

# Copiar prisma schema y generar cliente
COPY prisma ./prisma
RUN npx prisma generate

# Copiar el código ya compilado
COPY dist ./dist

EXPOSE 3000

# Push a la DB, luego Seed, luego Iniciar servidor
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node prisma/seed.js && node dist/index.js"]
