# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Installer toutes les dépendances (y compris dev pour le build)
RUN npm install

# Générer le client Prisma
RUN npx prisma generate

# Copier le code source
COPY src ./src/

# Compiler TypeScript
RUN npm run build

# ---- Stage 2: Production ----
FROM node:20-alpine AS production

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer seulement les dépendances de production
RUN npm install --omit=dev

# Générer le client Prisma (nécessaire en prod aussi)
RUN npx prisma generate

# Copier le build compilé
COPY --from=builder /app/dist ./dist

# Créer le dossier uploads
RUN mkdir -p uploads

# Exposer le port
EXPOSE 5000

# Migrations Prisma + démarrage du serveur
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
