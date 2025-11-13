# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Package installieren
COPY package*.json ./
RUN npm ci

# Code kopieren und bauen
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Production dependencies
COPY package*.json ./
RUN npm ci --production

# Kopiere das gebaute Projekt
COPY --from=build /app/dist ./dist

# SQLite-Datei mitkopieren
COPY db.sqlite ./db.sqlite

# Port exposed
EXPOSE 3000

# Start der App
CMD ["node", "dist/src/main.js"]
