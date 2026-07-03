# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY tsconfig*.json ./

# Installer toutes les dépendances
RUN npm install

# Variable d'environnement pour l'URL de l'API (injectée au build)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Copier le code source
COPY index.html ./
COPY src ./src/
COPY public ./public/
COPY postcss.config.js ./
COPY tailwind.config.js ./

# Build de production
RUN npm run build

# ---- Stage 2: Production avec Nginx ----
FROM nginx:alpine AS production

# Copier la config Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
